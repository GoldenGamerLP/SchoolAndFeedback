import * as z from "zod";

export default defineEventHandler(async (event) => {
  const { data, error } = await getValidatedQuery(
    event,
    validateOptionQuery.safeParseAsync
  );

  if (error) {
    throw createError({
      status: 400,
      message: "Invalid query parameters",
    });
  }

  return {
    options: {
      enabledModules: [
        {
          icon: "mdi:chat-question",
          name: "Fragen & Antworten",
          route: "threads",
          description: "Frage und Antworte anderen Schülern",
        },
        {
          icon: "mdi:information",
          name: "Informationen",
          route: "information",
          description: "Sehe Informationen über deine Schule",
        },
      ],
    },
  };
});

const validateOptionQuery = z.object({
  schoolnumber: z.coerce.number().int().positive(),
});
