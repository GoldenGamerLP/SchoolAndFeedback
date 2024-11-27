import * as z from "zod";
import { CreateAnswerDto } from "~/types/questions";

export default eventHandler(async (event) => {
  const { data, error } = await readValidatedBody(
    event,
    validationSchema.safeParseAsync
  );

  if (error) {
    throw createError({ statusCode: 400, message: error.message });
  }

  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const dto = data as CreateAnswerDto;
  const { qIdentifier, schoolId } = data;

  try {
    return await createAnswer(qIdentifier,dto,  user.id, schoolId);
  } catch (error: any) {
    throw createError({ statusCode: 404, message: error });
  }
});

const validationSchema = z.object({
  qIdentifier: z.string(),
  content: z.string(),
  schoolId: z.coerce.string(),
});
