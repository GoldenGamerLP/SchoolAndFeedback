import * as z from 'zod';
import { disableModule } from '~/server/utils/schoolUtils';

export default defineEventHandler(async (event) => {
    const { success, data, error } = await readValidatedBody(event, validationSchema.safeParseAsync);

    if (!success) {
        throw createError({
            message: 'Invalid query parameters',
            statusCode: 400,
            data: error,
        })
    }
    return await disableModule(data.schoolId, data.moduleId);
});

const validationSchema = z.object({
    schoolId: z.coerce.number().positive(),
    moduleId: z.coerce.number().positive(),
});