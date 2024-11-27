<template>
    <div class="flex-1 bg-card text-card-foreground p-4 rounded-t-xl border-t">
        <header class="flex gap-4">
            <NuxtLink
                :to="{ name: 'schools-schoolnumber-threads', params: { schoolnumber: $route.params.schoolnumber } }">
                <Button class="mb-4" size="icon" variant="secondary">
                    <Icon name="mdi:arrow-left"></Icon>
                    <span class="sr-only">Zurück</span>
                </Button>
            </NuxtLink>
            <div class="flex gap-4">
                <div class="grid" v-if="conversation">
                    <h1 class="text-xl font-bold">Frage - {{ conversation.question.title }}</h1>
                    <p class="text-muted-foreground flex items-center gap-2">
                        <Icon name=mdi:clock-time-four-outline class="text-xl"></Icon>
                        Am {{ useDateFormat(conversation.question.createdAt, 'dddd DD:MM:YYYY, HH:MM', {
                            locales:
                                'de-DE'
                        }) }} Uhr
                    </p>
                </div>
                <div v-else>
                    <h1 class="text-xl font-bold">Nicht gefunden!</h1>
                    <p class="text-muted-foreground">Diese Frage konnte leider nicht gefunden werden. {{ error?.message
                        }}</p>
                </div>
            </div>
        </header>
        <main v-if="conversation">
            <ol class="space-y-2 mt-2">
                <li>
                    <ConversationQuestion :conversation="conversation.question" :isVoting="isVoting" @vote="handleVote"
                        @goToAnswer="goToAnswer" />
                </li>
                <li v-for="answer in conversation?.answers" :key="answer.aIdentifier"
                    :id="'answer-' + answer.aIdentifier">
                    <ConversationAnswer :conversation="answer" :isVoting="isVoting" @vote="handleVote" />
                </li>
            </ol>
            <Separator orientation="horizontal" class="mt-4" v-if="conversation.answers.length"></Separator>
            <div class="bg-muted text-muted-foreground border border-border rounded-lg p-4 mt-4">
                <h2 class="text-xl font-bold">Antwort hinzufügen zu "{{ conversation?.question.title }}"</h2>
                <AutoForm :schema="schema" :form="form"
                    :fieldConfig="{ content: { component: 'textarea', hideLabel: true, inputProps: { placeholder: user ? 'Was denkst du?' : 'Logge dich ein um zu schreiben!', disabled: isSubmitting } } }"
                    @submit="createAnswer">
                    <Button type="submit" class="mt-2" :disabled="!user || isSubmitting">
                        <Icon v-if="isSubmitting" name="mdi:loading" class="mr-2 size-5 animate-spin"></Icon>
                        <Icon v-else name="mdi:plus" class="mr-2 size-5"></Icon>
                        Antwort hinzufügen
                    </Button>
                </AutoForm>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core';
import useQuestion from '~/composables/question';
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod';
import type { QuestionAnswerEndriched } from '~/types/questions';
import ConversationQuestion from '~/components/qAndA/ConversationQuestion.vue';
import ConversationAnswer from '~/components/qAndA/ConversationAnswer.vue';

const id = useRoute().params.id as string;
const questionComp = useQuestion();
const user = useUser();

definePageMeta({
    description: 'Alle Fragen und Antworten',
    layout: 'headline',
    pageTransition: {
        name: 'slide-right',
        mode: 'out-in'
    }
})

useSeoMeta({
    titleTemplate: 'Fragen - %s',
    title() {
        return id ? id as string : 'Alle Fragen';
    },
});

const schema = z.object({
    content: z.string().min(25, 'Deine Antwort sollte mindestens 25 Zeichen lang sein.').max(5000, 'Deine Antwort sollte nicht länger als 5000 Zeichen sein.').describe('Deine Antwort'),
});

const form = useForm({
    validationSchema: toTypedSchema(schema),
})

const isSubmitting = ref(false);
const isVoting = ref(false);

const handleVote = async (id: string, type: "question" | "answer", voteType: "up" | "down" | "answer" | "report") => {
    if (isVoting.value || !conversation.value) return;
    isVoting.value = true;

    let fallback;

    if (voteType === 'up' || voteType === 'down') {
        optimisticDownOrUpVote(id, type, voteType);
    } else if (voteType === 'answer') {
       fallback =  optimisticMarkAsAnswer(id);
    }

    try {
        const res = await questionComp.voteConversation(id, type, voteType);

        if (!res) {
            //Revert optimistic update

            if (voteType === 'up' || voteType === 'down') {
                //To revert the optimistic update, just toggle the vote again
                optimisticDownOrUpVote(id, type, voteType);
            } else if (voteType === 'answer') {
                //Can be undefined if no fallback is provided because the answer was not found or no answer was marked as answer before
                if(!fallback) return;
                optimisticMarkAsAnswer(fallback);
            }

            return;
        }
    } finally {
        isVoting.value = false;
    }
};

const optimisticMarkAsAnswer = (id: string) => {
    if (isVoting.value || !conversation.value) return;

    //Mark answer as answered
    for (let answer of conversation.value?.answers) {
        if (answer.aIdentifier === id) {
            answer.markedAsAnswer = true;
        } else {
            answer.markedAsAnswer = false;
        }
    }

    let lastAnswerId = conversation.value.question.answerId;

    //Mark question as answered
    conversation.value.question.answerId = id;

    //Return in case the changes are reverted
    return lastAnswerId;
};

const optimisticDownOrUpVote = (id: string, type: "question" | "answer", voteType: "up" | "down") => {
    if (isVoting.value || !conversation.value) return;

    try {
        const conversationElement = type === 'question' ? conversation.value.question : conversation.value.answers.find((a) => a.aIdentifier === id);

        if (!conversationElement) return;

        const hasDownVoted = conversationElement.hasDownvoted;
        const hasUpVoted = conversationElement.hasUpvoted;

        if (voteType === 'up') {
            //Toggle upvote
            conversationElement.hasUpvoted = !hasUpVoted;
            conversationElement.hasDownvoted = false;
            conversationElement.downVotesCount = hasDownVoted ? conversationElement.downVotesCount - 1 : conversationElement.downVotesCount;
            conversationElement.upVotesCount = hasUpVoted ? conversationElement.upVotesCount - 1 : conversationElement.upVotesCount;
        } else {
            //Toggle downvote
            conversationElement.hasDownvoted = !hasDownVoted;
            conversationElement.hasUpvoted = false;
            conversationElement.upVotesCount = hasUpVoted ? conversationElement.upVotesCount - 1 : conversationElement.upVotesCount;
            conversationElement.downVotesCount = hasDownVoted ? conversationElement.downVotesCount - 1 : conversationElement.downVotesCount;
        }
    } finally {
        isVoting.value = false;
    }
};

const createAnswer = async (data: { content: string }) => {
    isSubmitting.value = true;
    try {
        const res: QuestionAnswerEndriched = await questionComp.createAnswer(id, data.content);
        if (res) {
            form.resetForm();
            conversation.value?.answers.push(res);
        }
    } finally {
        isSubmitting.value = false;
    }
}

const goToAnswer = () => {
    //Scoll to answer
    const answer = document.getElementById('answer-' + conversation.value?.question.answerId);

    if (answer) {
        answer.scrollIntoView({ behavior: 'smooth' });
    }
}

const { data: conversation, error } = await useFetch("/api/v1/questions/conversation", {
    query: {
        id
    }
});
</script>