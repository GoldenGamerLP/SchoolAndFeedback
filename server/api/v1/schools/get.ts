import * as z from "zod";
import { getSchool } from "~/server/utils/schoolUtils";

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

  let { search } = data;

  try {
   return await getSchool(search);
  } catch (err) {
    throw err;
  }
});

const validationSchema = z.object({
  //Can be number or string and is required
  search: z.coerce.string().min(1),
});
