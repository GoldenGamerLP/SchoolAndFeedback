import { removeSchoolModerator } from "~/server/utils/schoolUtils";
import * as z from 'zod';

export default defineEventHandler(async (event) => {
    const { data, error, success } = await readValidatedBody(event, validateRemoveModeratorQuery.safeParseAsync);

    if (error) {
        throw createError({
            status: 400,
            message: "Invalid query parameters"
        });
    }

    const { schoolId, userId } = data;

    return await removeSchoolModerator(schoolId, userId);
});

const validateRemoveModeratorQuery = z.object({
    schoolId: z.coerce.number().int().positive(),
    userId: z.string(),
});