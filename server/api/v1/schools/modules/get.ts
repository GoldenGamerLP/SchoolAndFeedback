import * as z from 'zod';
import { getEnabledModulesWithDetails } from '~/server/utils/schoolUtils';

export default defineEventHandler(async (event) => {
    const { success, data, error } = await getValidatedQuery(event, validationSchema.safeParseAsync);

    if (!success) {
        throw createError({
            message: 'Invalid query parameters',
            statusCode: 400,
            data: error,
        })
    }
    const modules = await getEnabledModulesWithDetails(data.schoolId);
    
    return modules;
});

const validationSchema = z.object({
    schoolId: z.coerce.number().positive(),
});