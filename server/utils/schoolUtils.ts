import database from "./mongodbUtils";
import {
  type ModeratorEntry,
  School,
  SchoolSettings,
  SuggestedModerator,
} from "~/types/school";

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
const schoolSettingsCollection =
  database.collection<SchoolSettings>("schoolSettings");
const suggestedSchoolModerators = database.collection<SuggestedModerator>(
  "suggestedSchoolModerators"
);

export async function getEnabledModules(schoolId: number): Promise<number[]> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });
  if (!settings) return [];

  return settings.modules || [];
}

export async function enableModule(
  schoolId: number,
  moduleId: number
): Promise<boolean> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });
  if (!settings) return false;

  if (settings.modules.includes(moduleId)) return true;

  await schoolSettingsCollection.updateOne(
    { schoolId },
    {
      $push: {
        modules: moduleId,
      },
    }
  );

  return true;
}

export async function disableModule(
  schoolId: number,
  moduleId: number
): Promise<boolean> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });
  if (!settings) return false;

  if (!settings.modules.includes(moduleId)) return true;

  await schoolSettingsCollection.updateOne(
    { schoolId },
    {
      $pull: {
        modules: moduleId,
      },
    }
  );

  return true;
}

export async function isModerator(
  schoolId: number,
  id: string
): Promise<boolean> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });
  if (!settings) return false;

  return settings.moderators.includes(id);
}

export function getAllModules() {
  return moduleOptions;
}

export async function getEnabledModulesWithDetails(schoolId: number) {
  const modules = await getEnabledModules(schoolId);
  return getAllModules().filter((module) => modules.includes(module.id));
}

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

  const existingRequest = await suggestedSchoolModerators.findOne({
    schoolId: data.schoolId,
    userId: data.userId,
  });
  if (existingRequest) return false;

  const res = await suggestedSchoolModerators.insertOne(data);
  return !!res.insertedId;
}

export async function getSuggestedModerators(
  schoolId: number
): Promise<ModeratorEntry[]> {
  const response = suggestedSchoolModerators.aggregate([
    {
      $match: {
        schoolId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        //Important! _id is the field in the users collection
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $unwind: "$users",
    },
    {
      $lookup: {
        from: "schools",
        localField: "schoolId",
        foreignField: "schulnummer",
        as: "school",
      },
    },
    {
      $unwind: "$school",
    },
    {
      $project: {
        displayname: "$users.displayname",
        email: "$users.email",
        message: 1,
        schoolId: 1,
        userId: 1,
        school: {
          schulname: 1,
          schulnummer: 1,
          kurz_bezeichnung: 1,
          ort: 1,
        },
      },
    },
  ]);

  return (await response.toArray()) as ModeratorEntry[];
}

export async function getCurrentModerators(
  schoolId: number
): Promise<ModeratorEntry[]> {
  const response = schoolSettingsCollection.aggregate([
    {
      $match: {
        schoolId,
      },
    },
    {
      $lookup: {
        from: "schools",
        localField: "schoolId",
        foreignField: "schulnummer",
        as: "school",
      },
    },
    {
      $unwind: "$school",
    },
    {
      $project: {
        school: {
          schulname: 1,
          schulnummer: 1,
          kurz_bezeichnung: 1,
          ort: 1,
        },
        moderators: 1,
      },
    },
    {
      $unwind: "$moderators",
    },
    {
      $project: {
        school: 1,
        userId: "$moderators",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $unwind: "$users",
    },
    {
      $project: {
        displayname: "$users.displayname",
        email: "$users.mail",
        school: 1,
        userId: 1,
      },
    },
  ]);

  return (await response.toArray()) as ModeratorEntry[];
}

export async function acceptModeratorRequest(
  schoolId: number,
  userId: string
): Promise<boolean> {
  const request = await suggestedSchoolModerators.findOne({ schoolId, userId });
  if (!request) return false;

  await schoolSettingsCollection.updateOne(
    { schoolId },
    {
      $push: {
        moderators: userId,
        modules: { $each: getAllModules().map((module) => module.id) },
      },
    },
    {
      upsert: true,
    }
  );

  await suggestedSchoolModerators.deleteOne({ schoolId, userId });
  return true;
}

export async function declineModeratorRequest(
  schoolId: number,
  userId: string
): Promise<boolean> {
  const request = await suggestedSchoolModerators.findOne({ schoolId, userId });
  if (!request) return false;

  await suggestedSchoolModerators.deleteOne({ schoolId, userId });
  return true;
}

export async function isSchoolEnabled(schoolId: number): Promise<boolean> {
  return (await getSchoolModeratorSize(schoolId)) > 0;
}

export async function removeSchoolModerator(
  schoolId: number,
  userId: string
): Promise<boolean> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });

  if (!settings) return false;

  await schoolSettingsCollection.updateOne(
    { schoolId },
    {
      $pull: {
        moderators: userId,
      },
    }
  );

  return true;
}

export async function getSchoolModeratorSize(
  schoolId: number
): Promise<number> {
  const settings = await schoolSettingsCollection.findOne({ schoolId });

  if (!settings || !settings.moderators) {
    return 0;
  }

  return settings.moderators.length;
}

export async function getSchoolById(schoolId: number): Promise<School | null> {
  return schoolsCollection.findOne({ schulnummer: schoolId });
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
