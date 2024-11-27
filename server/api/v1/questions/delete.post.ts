import { deleteQuestion } from "@/server/utils/questionsUtils";
import * as z from "zod";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const user = event.context.user;

    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' });

    //TODO: Validate 
    const validatedData = validationSchema.parse(body);

    return await deleteQuestion(validatedData.id);
});

const validationSchema = z.object({
    id: z.string(),
});

