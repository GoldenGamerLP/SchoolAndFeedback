import { getConversation } from "@/server/utils/questionsUtils";
import * as z from "zod";

export default defineEventHandler(async (event) => {
  const { data, error } = await getValidatedQuery(
    event,
    validationSchema.safeParseAsync
  );

  if (error) {
    throw createError({ statusCode: 400, message: error.message });
  }

  const user = event.context.user;

  try {
    return await getConversation(data.id, user?.id);
  } catch (error) {
    throw createError({ statusCode: 404, message: error });
  }
});

const validationSchema = z.object({
  id: z.string(),
});
