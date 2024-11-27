import * as z from "zod";
import { getSchoolById } from "~/server/utils/schoolUtils";

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
    return await getSchoolById(schoolnumber);
  } catch (err) {
    throw err;
  }
});

const validationSchema = z.object({
  schoolnumber: z.coerce.number().int().positive(),
});
