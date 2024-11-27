import { generateId } from "lucia";
import database from "~/server/utils/mongodbUtils";
import {
  CreateAnswerDto,
  CreateQuestionDto,
  Conversation,
  Question,
  QuestionAnswer,
  QuestionEnriched,
  QuestionAnswerEndriched,
} from "~/types/questions";

const questionsCollection = database.collection<Question>("questions");
const answersCollection = database.collection<QuestionAnswer>("answers");

export async function getQuestions(
  search: string,
  schoolId: string,
  userId?: string,
  sort?: "newest" | "oldest" | "votes",
  searchCriteria?: "relevance" | "open" | "answered" | "own"
) {
  const sortQuery: any = {};

  switch (sort) {
    case "newest":
      sortQuery.createdAt = -1;
      break;
    case "oldest":
      sortQuery.createdAt = 1;
      break;
    case "votes":
      sortQuery.upVotesCount = -1;
      break;
    default:
      sortQuery.createdAt = -1;
  }

  // Sort pinned first
  sortQuery.isPinned = -1;

  const questions = (await questionsCollection
    .aggregate([
      {
        $match: {
          title: { $regex: search || "", $options: "i" },
          schoolId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields: {
          upVotesCount: { $ifNull: [{ $size: "$upvotes" }, 0] },
          downVotesCount: { $ifNull: [{ $size: "$downvotes" }, 0] },
          hasUpvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$upvotes", []] }] },
              then: true,
              else: false,
            },
          },
          hasDownvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$downvotes", []] }] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $sort: sortQuery,
      },
      {
        $project: {
          _id: 1,
          qIdentifier: 1,
          title: 1,
          description: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          schoolId: 1,
          isPinned: 1,
          hasUpvoted: 1,
          hasDownvoted: 1,
          upVotesCount: 1,
          downVotesCount: 1,
          author: { $arrayElemAt: ["$author.displayname", 0] },
        },
      },
    ])
    .toArray()) as QuestionEnriched[];

  //FixMe: Use aggregation pipeline to count answers
  for (let i = 0; i < questions.length; i++) {
    const answers = await answersCollection.countDocuments({
      questionId: questions[i].qIdentifier,
    });

    questions[i].conversationsCount = answers;
  }

  return questions as QuestionEnriched[];
}

export async function getQuestionById(id: string) {
  return await questionsCollection.findOne({ qIdentifier: id });
}

export async function getAnswersForQuestion(id: string, userId?: string) {
  console.log("getAnswersForQuestion", id, userId);
  const answers = await answersCollection
    .aggregate([
      {
        $match: {
          questionId: id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields: {
          upVotesCount: { $ifNull: [{ $size: "$upvotes" }, 0] },
          downVotesCount: { $ifNull: [{ $size: "$downvotes" }, 0] },
          hasUpvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$upvotes", []] }] },
              then: true,
              else: false,
            },
          },
          hasDownvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$downvotes", []] }] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $project: {
          aIdentifier: 1,
          questionId: 1,
          answer: 1,
          createdAt: 1,
          schoolId: 1,
          hasUpvoted: 1,
          hasDownvoted: 1,
          markedAsAnswer: 1,
          upVotesCount: 1,
          downVotesCount: 1,
          author: { $arrayElemAt: ["$author.displayname", 0] },
          authorId: { $arrayElemAt: ["$author._id", 0] },
        },
      },
    ])
    .toArray();

  return answers as QuestionAnswerEndriched[];
}

export async function createQuestion(
  body: CreateQuestionDto,
  author: string,
  schoolId: string
) {
  const question: Question = {
    qIdentifier:
      body.title.toLowerCase().replace(/\s/g, "-") + "-" + generateId(5),
    title: body.title,
    schoolId,
    description: body.description,
    tags: body.tags,
    author,
    createdAt: new Date(),
    upvotes: [],
    downvotes: [],
    isPinned: false,
  };

  await questionsCollection.insertOne(question);
  return question;
}

export async function createAnswer(
  questionId: string,
  body: CreateAnswerDto,
  author: string,
  schoolId: string
) {
  const answer: QuestionAnswer = {
    aIdentifier: generateId(16),
    questionId,
    schoolId,
    author,
    answer: body.content,
    markedAsAnswer: false,
    createdAt: new Date(),
    upvotes: [],
    downvotes: [],
  };

  await answersCollection.insertOne(answer);
  const res: QuestionAnswerEndriched = {
    ...answer,
    hasUpvoted: false,
    hasDownvoted: false,
    upVotesCount: 0,
    downVotesCount: 0,
  };

  return res;
}

// Vote management functions
export async function vote(
  type: "question" | "answer" | "answer" | "report",
  id: string,
  userId: string,
  voteType: "up" | "down" | "none",
) {
  //FIXME: Add report handling
  const collection =
    type === "question" ? questionsCollection : answersCollection;
  const identifier = type === "question" ? "qIdentifier" : "aIdentifier";

  const item = await collection.findOne({ [identifier]: id });
  if (!item) throw new Error("Item not found");

  //For voting
  if (type === "question" || type === "answer") {
    await collection.updateOne(
      { [identifier]: id },
      {
        $pull: {
          upvotes: userId,
          downvotes: userId,
        },
      }
    );

    // Add new vote
    if (voteType === "up") {
      await collection.updateOne(
        { [identifier]: id },
        { $addToSet: { upvotes: userId } }
      );
    } else {
      await collection.updateOne(
        { [identifier]: id },
        { $addToSet: { downvotes: userId } }
      );
    }
  }

  //For marking as answer
  if (type === "answer") {
    const crrItem = item as QuestionAnswer;
    const questionId = crrItem.questionId;
    if(!questionId) throw new Error("Question not found");

    await answersCollection.updateMany(
      { questionId },
      { $set: { markedAsAnswer: false } }
    );

    await answersCollection.updateOne(
      { [identifier]: id },
      { $set: { markedAsAnswer: true } }
    );

    await questionsCollection.updateOne(
      { qIdentifier: questionId },
      { $set: { answerId: id } }
    );
  }
}

export async function getVoteStatus(
  type: "question" | "answer",
  id: string,
  userId: string
) {
  const collection =
    type === "question" ? questionsCollection : answersCollection;
  const identifier = type === "question" ? "qIdentifier" : "aIdentifier";

  const item = await collection.findOne({ [identifier]: id });
  if (!item) return null;

  return {
    hasUpvoted: item.upvotes.includes(userId),
    hasDownvoted: item.downvotes.includes(userId),
    upvoteCount: item.upvotes.length,
    downvoteCount: item.downvotes.length,
  };
}

// Question management
export async function updateQuestion(id: string, data: Partial<Question>) {
  const { modifiedCount } = await questionsCollection.updateOne(
    { qIdentifier: id },
    { $set: data }
  );
  return modifiedCount > 0;
}

export async function deleteQuestion(id: string) {
  const { deletedCount } = await questionsCollection.deleteOne({
    qIdentifier: id,
  });
  // Delete associated answers
  await answersCollection.deleteMany({ questionId: id });
  return deletedCount > 0;
}

// Answer management
export async function updateAnswer(id: string, data: Partial<QuestionAnswer>) {
  const { modifiedCount } = await answersCollection.updateOne(
    { aIdentifier: id },
    { $set: data }
  );
  return modifiedCount > 0;
}

export async function deleteAnswer(id: string) {
  const { deletedCount } = await answersCollection.deleteOne({
    aIdentifier: id,
  });
  return deletedCount > 0;
}

export async function markAnswerAsSolution(
  questionId: string,
  answerId: string
) {
  // Remove previous solution mark if exists
  await answersCollection.updateMany(
    { questionId },
    { $set: { markedAsAnswer: false } }
  );

  // Mark new solution
  await answersCollection.updateOne(
    { aIdentifier: answerId },
    { $set: { markedAsAnswer: true } }
  );

  // Update question with solution
  await questionsCollection.updateOne(
    { qIdentifier: questionId },
    { $set: { answerId } }
  );
}

// Get conversation with computed vote counts
export async function getConversation(
  questionId: string,
  userId?: string
): Promise<Conversation> {
  const questions = (await questionsCollection
    .aggregate([
      {
        $match: {
          qIdentifier: questionId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields: {
          upVotesCount: { $ifNull: [{ $size: "$upvotes" }, 0] },
          downVotesCount: { $ifNull: [{ $size: "$downvotes" }, 0] },
          hasUpvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$upvotes", []] }] },
              then: true,
              else: false,
            },
          },
          hasDownvoted: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$downvotes", []] }] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          qIdentifier: 1,
          title: 1,
          description: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          schoolId: 1,
          isPinned: 1,
          hasUpvoted: 1,
          hasDownvoted: 1,
          upVotesCount: 1,
          downVotesCount: 1,
          author: { $arrayElemAt: ["$author.displayname", 0] },
        },
      },
    ])
    .toArray()) as QuestionEnriched[];

  const question = questions[0];
  if (!question) throw new Error("Question not found");

  const answers = (await getAnswersForQuestion(
    questionId,
    userId
  )) as QuestionAnswerEndriched[];

  return {
    question,
    answers,
  };
}
