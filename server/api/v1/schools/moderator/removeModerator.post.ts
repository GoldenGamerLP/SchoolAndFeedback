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

    const { schoolId, mail } = data;

    return await removeSchoolModerator(schoolId, mail);
});

const validateRemoveModeratorQuery = z.object({
    schoolId: z.coerce.number().int().positive(),
    mail: z.string().email(),
});