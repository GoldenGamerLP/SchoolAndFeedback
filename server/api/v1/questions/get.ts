import * as z from 'zod';
import { getQuestions } from '~/server/utils/questionsUtils';

export default defineEventHandler(async (event) => {
    const { data, error } = await getValidatedQuery(event, validationSchema.safeParseAsync);

    if(error) {
        throw createError({
            message: 'Invalid query parameters',
            data: error.errors,
            status: 400,
        })
    }

    const { searchCriteria, search, sort, schoolId } = data;
    const user = event.context.user;

    try {
        //Search, schoolId, userId, sort, searchCriteria
        const questions = await getQuestions(search ?? "", schoolId, user?.id, sort, searchCriteria);
        return questions;
    } catch (err) {
        throw createError({
            message: 'Failed to fetch questions',
            cause: err,
            status: 500,
        })
    }
});

const validationSchema = z.object({
    searchCriteria: z.enum(['relevance', 'open', 'answered', 'own']).optional(),
    search: z.string().optional(),
    sort: z.enum(['newest', 'oldest', 'votes']).optional(),
    schoolId: z.string(),
});