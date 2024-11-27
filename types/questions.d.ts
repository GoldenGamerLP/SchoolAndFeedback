export interface Voteable {
  // Array of user IDs
  upvotes: string[];
  downvotes: string[];
}

export interface Question extends Voteable {
  qIdentifier: string;
  schoolId: string;

  isPinned: boolean;
  title: string;
  description: string;
  tags: string[];
  author: string;
  createdAt: Date;
  //If the question has an answer
  answerId?: string;
}

export interface QuestionAnswer extends Voteable {
  aIdentifier: string;
  questionId: string;
  schoolId: string;

  author: string;
  answer: string;
  createdAt: Date;
  //Computed field:
  markedAsAnswer: boolean;
}

//Computed for frontend
export interface Conversation {
  question: QuestionEnriched;
  answers: QuestionAnswerEndriched[];
}

export interface QuestionEnriched extends Question {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  upVotesCount: number;
  downVotesCount: number;
  conversationsCount: number;
}

export interface QuestionAnswerEndriched extends QuestionAnswer {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  upVotesCount: number;
  downVotesCount: number;
  authorId: string;
}

export interface CreateQuestionDto {
  title: string;
  description: string;
  tags: string[];
}

export interface CreateAnswerDto {
  content: string;
}
