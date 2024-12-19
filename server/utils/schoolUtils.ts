import database from "./mongodbUtils";
import {type ModeratorEntry, School, SchoolSettings, SuggestedModerator} from "~/types/school";

const moduleOptions = [
    {
        id: 1,
        icon: "mdi:chat-question",
        name: "Fragen & Antworten",
        route: "threads",
        description: "Frage und Antworte anderen Schülern",
    },
    {
        id: 2,
        icon: "mdi:information",
        name: "Informationen",
        route: "information",
        description: "Sehe Informationen über deine Schule",
    },
];

const schoolsCollection = database.collection<School>("schools");
const schoolModeratorsCollection = database.collection<SchoolSettings>("schoolSettings");
const suggestedSchoolModerators = database.collection<SuggestedModerator>("suggestedSchoolModerators");

//Use search index to search for schools
export async function getSchool(searchTerm: string): Promise<School[]> {
    const response = await schoolsCollection
        .aggregate(getAggregationQuery(searchTerm))
        .toArray();

    return response as School[];
}

export async function addNewSuggestedModerator(data: SuggestedModerator) {
    //Check if the school is valid and has this pending request already
    const school = await getSchoolById(data.schoolId);
    if (!school) return false;

    const existingRequest = await suggestedSchoolModerators.findOne({schoolId: data.schoolId, email: data.email});
    if (existingRequest) return false;

    const res = await suggestedSchoolModerators.insertOne(data);
    return !!res.insertedId;
}

export async function getSuggestedModerators(): Promise<ModeratorEntry[]> {
    const response = suggestedSchoolModerators.aggregate([{
        $lookup: {
            from: "schools",
            localField: "schoolId",
            foreignField: "schulnummer",
            as: "school",
        },
    }, {
        $unwind: "$school",
    }, {
        $project: {
            school: {
                schulname: 1,
                schulnummer: 1,
                kurz_bezeichnung: 1,
                ort: 1,
            },
            email: 1,
            message: 1,
        },
    }])

    return await response.toArray() as ModeratorEntry[];
}

export async function getCurrentModerators(schoolId: number): Promise<ModeratorEntry[]> {
    const response = schoolModeratorsCollection.aggregate([{
        $match: {
            schoolId,
        },
    }, {
        $lookup: {
            from: "schools",
            localField: "schoolId",
            foreignField: "schulnummer",
            as: "school",
        },
    }, {
        $unwind: "$school",
    }, {
        $project: {
            school: {
                schulname: 1,
                schulnummer: 1,
                kurz_bezeichnung: 1,
                ort: 1,
            },
            moderators: 1,
        },
    }, {
        $unwind: "$moderators",
    }, {
        $project: {
            school: 1,
            email: "$moderators",
        },
    }, {
        $lookup: {
            from: "suggestedSchoolModerators",
            localField: "email",
            foreignField: "email",
            as: "suggested",
        }
    }]);

    return await response.toArray() as ModeratorEntry[];
}

export async function acceptModeratorRequest(schoolId: number, email: string): Promise<boolean> {
    const request = await suggestedSchoolModerators.findOne({schoolId, email});
    if (!request) return false;

    await schoolModeratorsCollection.updateOne({schoolId}, {
        $push: {
            moderators: email,
        },
    }, {
        upsert: true,
    });

    await suggestedSchoolModerators.deleteOne({schoolId, email});
    return true;
}

export async function declineModeratorRequest(schoolId: number, email: string): Promise<boolean> {
    const request = await suggestedSchoolModerators.findOne({schoolId, email});
    if (!request) return false;

    await suggestedSchoolModerators.deleteOne({schoolId, email});
    return true;
}

export async function isSchoolEnabled(schoolId: number): Promise<boolean> {
    return await getSchoolModeratorSize(schoolId) > 0;
}

export async function removeSchoolModerator(schoolId: number, email: string): Promise<boolean> {
    const settings = await schoolModeratorsCollection.findOne({schoolId});

    if (!settings) return false;

    await schoolModeratorsCollection.updateOne({schoolId }, {
        $pull: {
            moderators: email,
        },
    });

    return true;
}

export async function getSchoolModeratorSize(schoolId: number): Promise<number> {
    const settings = await schoolModeratorsCollection.find({schoolId}, {
        projection: {
            schoolId: 1,
            moderators: 1
        }
    }).limit(1).next();
    if (!settings || settings.schoolId !== schoolId) {
        return 0;
    }

    return settings.moderators.length;
}

export async function getSchoolById(schoolId: number): Promise<School | null> {
    return schoolsCollection.findOne({schulnummer: schoolId});
}

function getAggregationQuery(searchTerm: string) {
    searchTerm = sanitizedTerm(searchTerm);
    return [
        {
            $project: {
                schulname: 1,
                schulnummer: 1,
                kurz_bezeichnung: 1,
                ort: 1,
            },
        },
        {
            $match: {
                $or: [
                    {
                        schulname: {
                            $regex: searchTerm,
                            $options: "i",
                        },
                    },
                    {
                        kurz_bezeichnung: {
                            $regex: searchTerm,
                            $options: "i",
                        },
                    },
                ],
            },
        },
        {
            $limit: 10,
        },
        {
            $sort: {
                schulname: 1,
            },
        },
    ];
}

function sanitizedTerm(searchTerm: string) {
    return searchTerm.replace(/[^a-zA-Z0-9]/g, "");
}
