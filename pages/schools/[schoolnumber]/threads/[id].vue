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

    if(voteType === 'up' || voteType === 'down') {
        const target = type === 'question' ? conversation.value.question : conversation.value.answers.find(a => a.aIdentifier === id);
        if (!target) return;
        if (voteType === 'up') {
            target.upVotesCount = target.hasUpvoted ? target.upVotesCount - 1 : target.upVotesCount + 1;
            target.hasUpvoted = !target.hasUpvoted;
        } else {
            target.downVotesCount = target.hasDownvoted ? target.downVotesCount - 1 : target.downVotesCount + 1;
            target.hasDownvoted = !target.hasDownvoted;
        }
    }

    //Dont do this with set answer because it will trigger a re-render

    try {
        const res = await questionComp.voteConversation(id, type, voteType);

        if(!res) return;

        // Revert changes
        if(voteType === 'up' || voteType === 'down') {
            const target = type === 'question' ? conversation.value.question : conversation.value.answers.find(a => a.aIdentifier === id);
            if (!target) return;
            if (voteType === 'up') {
                target.upVotesCount = target.hasUpvoted ? target.upVotesCount - 1 : target.upVotesCount + 1;
                target.hasUpvoted = !target.hasUpvoted;
            } else {
                target.downVotesCount = target.hasDownvoted ? target.downVotesCount - 1 : target.downVotesCount + 1;
                target.hasDownvoted = !target.hasDownvoted;
            }
        }

        if(voteType === 'answer') {
            const target = conversation.value.answers.find(a => a.aIdentifier === id);
            if (!target) return;
            target.markedAsAnswer = !target.markedAsAnswer;

            //Toggle other answers
            conversation.value.answers.forEach(a => {
                if(a.aIdentifier !== id) {
                    a.markedAsAnswer = false;
                }
            });

            //Set questions answerId
            conversation.value.question.answerId = target.markedAsAnswer ? id : undefined;
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