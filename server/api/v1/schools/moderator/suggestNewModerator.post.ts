import * as z from "zod";
import {addNewSuggestedModerator} from "~/server/utils/schoolUtils";

export default defineEventHandler(async (event) => {
    const { data, error } = await readValidatedBody(
        event,
        validateSuggestNewModeratorQuery.safeParseAsync
    );

    if (error) {
        throw createError({
            status: 400,
            message: "Invalid query parameters",
            statusText: error.message,
        });
    }

    const { schoolId, userId, message } = data;

    return await addNewSuggestedModerator({schoolId, userId, message});
});

export const validateSuggestNewModeratorQuery = z.object({
    schoolId: z.coerce.number().int().positive(),
    userId: z.string(),
    message: z.string(),
});