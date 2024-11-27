import database from "./mongodbUtils";
import { School } from "~/types/school";

const schoolsCollection = database.collection<School>("schools");

//Use search index to search for schools
export async function getSchool(searchTerm: string): Promise<School[]> {
  const response = await schoolsCollection
    .aggregate(getAggregationQuery(searchTerm))
    .toArray();

  return response as School[];
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
