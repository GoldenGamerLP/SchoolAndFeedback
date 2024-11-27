import { createQuestion } from "@/server/utils/questionsUtils";
import { CreateQuestionDto } from "@/types/questions";
import * as z from "zod";

export default defineEventHandler(async (event) => {
  const { data, error } = await readValidatedBody(
    event,
    validationSchema.safeParseAsync
  );

  if (error) {
    console.log(error.message);
    throw createError({ statusCode: 400, message: error.message });
  }

  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const question: CreateQuestionDto = data;

  return await createQuestion(question, user.id, data.schoolId);
});

//Interface from types questions.d.ts
//{ title: 'dasdas', descirption: 'adsadsda', tags: [], schoolId: 192946 }
const validationSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    schoolId: z.coerce.string(),
});
