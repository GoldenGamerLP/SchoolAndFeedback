
import { getAnswersForQuestion } from '~/server/utils/questionsUtils';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
        throw createError({
            message: 'Question ID is required',
            status: 400,
        });
    }

    const user = event.context.user;

    try {
        const answers = await getAnswersForQuestion(id, user?.id);
        return { answers };
    } catch (err) {
        throw createError({
            message: 'Failed to fetch answers',
            cause: err,
            status: 500,
        });
    }
});