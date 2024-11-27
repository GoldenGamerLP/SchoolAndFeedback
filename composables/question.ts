import type { CreateQuestionDto, QuestionAnswerEndriched } from "~/types/questions";

const useQuestion = () => {
  const schoolId = useCurrentSchool();

  const createQuestion = async (question: CreateQuestionDto) => {
    return await $fetch("/api/v1/questions/create", {
      method: "POST",
      body: JSON.stringify({
        title: question.title,
        description: question.description,
        tags: question.tags,
        schoolId: schoolId.value?.schulnummer,
      }),
    });
  };

  const getQuestion = async (id: string) => {
    return await $fetch(`/api/v1/questions/${id}`);
  };

  const deleteQuestion = async (id: string) => {
    return await $fetch(`/api/v1/questions/`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  };

  const updateQuestion = async (id: string, question: string) => {
    return await $fetch(`/api/v1/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ question }),
    });
  };

  const voteConversation = async (
    id: string,
    type: "question" | "answer" | "report" | "answer",
    voteType: "up" | "down" | "none"
  ) => {
    try {
      const response = await $fetch(`/api/v1/questions/votes/vote`, {
        method: "PATCH",
        body: JSON.stringify({ id, type, voteType }),
      });
      return response;
    } catch (error) {
      // Revert optimistic update on error
      return false;
    }
  };

  const createAnswer = async (qIdentifier: string, content: string) => {
    const loading = ref(true);
    try {
      const response = await $fetch(`/api/v1/questions/answers/create`, {
        method: "POST",
        body: JSON.stringify({
          content,
          qIdentifier,
          schoolId: schoolId.value?.schulnummer,
        }),
      });
      return response;
    } finally {
      loading.value = false;
    }
  };

  return {
    createQuestion,
    getQuestion,
    deleteQuestion,
    updateQuestion,
    voteConversation,
    createAnswer,
  };
};

export default useQuestion;