import * as z from "zod";
import { isModerator } from "~/server/utils/schoolUtils";

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
    
    const { schoolId, userId } = data;
    
    return await isModerator(schoolId, userId);
});

const validationSchema = z.object({
  schoolId: z.coerce.number().int().positive(),
  userId: z.string(),
});