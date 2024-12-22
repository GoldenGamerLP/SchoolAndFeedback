import { getSuggestedModerators } from "~/server/utils/schoolUtils";
import * as z from 'zod';

export default defineEventHandler(async (event) => {
    const { data, success, error } = await getValidatedQuery(event, schema.safeParseAsync);

    if(!success) {
        throw createError({
            message: 'Invalid request',
            status: 400
        });
    }

    return (await getSuggestedModerators(data.schoolId));
});

export const schema = z.object({
    schoolId: z.coerce.number().int().positive(),
});