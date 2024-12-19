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

    const { schoolId, email, message } = data;

    return await addNewSuggestedModerator({schoolId, email, message});
});

export const validateSuggestNewModeratorQuery = z.object({
    schoolId: z.coerce.number().int().positive(),
    email: z.string(),
    message: z.string(),
});