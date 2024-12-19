import {getCurrentModerators } from "~/server/utils/schoolUtils";
import * as z from 'zod';

export default defineEventHandler(async (event) => {
    const { data, error, success } = await getValidatedQuery(event, validateGetModeratorsQuery.safeParseAsync);

    if (error) {
        throw createError({
            status: 400,
            message: "Invalid query parameters"
        });
    }

    const { schoolId } = data;

    return await getCurrentModerators(schoolId);
});

const validateGetModeratorsQuery = z.object({
    schoolId: z.coerce.number().int().positive()
});