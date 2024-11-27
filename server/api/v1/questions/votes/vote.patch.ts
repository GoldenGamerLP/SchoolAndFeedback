import * as z from "zod";
import { vote } from "@/server/utils/questionsUtils";

export default defineEventHandler(async (event) => {
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

  const { id, type, voteType } = data;

  return await vote(type, id, user.id, voteType);
});

const validationSchema = z.object({
  id: z.string(),
  type: z.enum(["question", "answer", "answer", "report"]),
  voteType: z.enum(["up", "down", "none"]).optional().default("none"),
});
