import * as z from "zod";

export default defineEventHandler(async (event) => {
  const { data, error } = await getValidatedQuery(
    event,
    validationSchema.safeParseAsync
  );

  if (error) {
    throw createError({
      message: "Invalid query parameters",
      data: error.errors,
      status: 400,
    });
  }

  let { schoolnumber } = data;

  try {
    return await isRegistered(schoolnumber);
  } catch (err) {
    throw err;
  }
});

const validationSchema = z.object({
  schoolnumber: z.number().int().positive(),
});
