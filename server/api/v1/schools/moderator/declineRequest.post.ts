import { declineModeratorRequest } from "~/server/utils/schoolUtils";
import * as z from 'zod';

export default defineEventHandler(async (event) => {
    const { data, error, success } = await readValidatedBody(event, validateDeclineRequestQuery.safeParseAsync);

    if (error) {
        throw createError({
            status: 400,
            message: "Invalid query parameters"
        });
    }

    const { schoolId, mail } = data;

    return await declineModeratorRequest(schoolId, mail);
});

const validateDeclineRequestQuery = z.object({
    schoolId: z.coerce.number().int().positive(),
    mail: z.string().email(),
});