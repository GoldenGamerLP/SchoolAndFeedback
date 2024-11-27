<template>
    <li :key="question.qIdentifier"
        class="bg-secondary text-secondary-foreground p-4 flex rounded-xl hover:shadow-xl hover:-translate-y-1 transition-transform transform-gpu justify-between"
        role="listitem">
        <NuxtLink
            :to="{ name: 'schools-schoolnumber-threads-id', params: { schoolnumber: schoolId, id: question.qIdentifier } }"
            class="flex-1">
            <div class="w-full flex flex-col md:flex-row">
                <div class="flex-grow">
                    <div class="flex flex-col">
                        <div class="flex gap-4">
                            <h1 class="text-xl font-bold flex items-center gap-2">
                                <Icon name="mdi:pin" class="text-xl text-primary" v-if="question.isPinned">
                                </Icon>
                                Frage: {{ question.title }}
                            </h1>
                            <span class="space-x-1 my-1">
                                <Badge v-for="tag in question.tags" :key="tag">
                                    {{ tag }}
                                </Badge>
                            </span>
                        </div>
                        <p class="truncate flex items-center text-foreground/50 max-w-full md:max-w-[80vw]">
                            <Icon name="mdi:comment-text-outline" class="mr-2"></Icon>
                            {{ question.description }}
                        </p>
                        <p class="text-muted-foreground flex items-center">
                            <Icon name="mdi:account" class="mr-2"></Icon>
                            {{ question.author }}
                        </p>
                        <span class="text-muted-foreground md:hidden flex items-center gap-2">
                            <Icon name="mdi:clock-time-four-outline" class="text-xl"></Icon>
                            {{ useTimeAgo(question.createdAt) }}
                        </span>
                        <div class="flex space-x-2 text-sm text-muted-foreground">
                            <button class="flex items-center gap-2" :disabled="isVoting"
                                :class="{ 'text-primary': question.hasUpvoted }" @click.prevent="handleVote('up')">
                                <Icon name="mdi:thumb-up"></Icon>
                                {{ question.upVotesCount }}
                            </button>
                            <button class="flex items-center gap-2" :disabled="isVoting"
                                :class="{ 'text-primary': question.hasDownvoted }" @click.prevent="handleVote('down')">
                                <Icon name="mdi:thumb-down"></Icon>
                                {{ question.downVotesCount }}
                            </button>
                            <span class="flex items-center gap-2">
                                <Icon name="mdi:comment-text-outline"></Icon>
                                {{ question.conversationsCount }}
                            </span>
                            <span v-if="question.answerId" class="flex items-center gap-2" title="Hat Antwort">
                                <Icon name="mdi:check-all"></Icon>
                                <span class="sr-only">Hat Antwort</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="hidden md:flex items-center flex-col mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                    <img :src="question.author" alt="Placeholder" class="object-cover aspect-square rounded size-20"
                        v-if="false" />
                    <span v-else
                        class="bg-card text-primary-foreground rounded-full size-20 flex items-center justify-center">
                        <Icon name="mdi:account" class="text-xl"></Icon>
                    </span>
                    <span class="text-xs text-muted-foreground mt-auto">{{ useTimeAgo(question.createdAt) }}</span>
                </div>
            </div>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
import useQuestion from '~/composables/question';
import { type QuestionEnriched } from '~/types/questions';

const schoolId = useCurrentSchool().value?.schulnummer;

const props = defineProps<{
    question: QuestionEnriched;
}>();

const questionComp = useQuestion();
const isVoting = ref(false);

const handleVote = async (voteType: "up" | "down") => {
    if (isVoting.value) return;
    isVoting.value = true;

    // Remove existing vote if any
    if (voteType === 'up' && props.question.hasDownvoted) {
        props.question.downVotesCount--;
        props.question.hasDownvoted = false;
    } else if (voteType === 'down' && props.question.hasUpvoted) {
        props.question.upVotesCount--;
        props.question.hasUpvoted = false;
    }

    // Toggle current vote
    if (voteType === 'up') {
        if (props.question.hasUpvoted) {
            props.question.upVotesCount--;
            props.question.hasUpvoted = false;
        } else {
            props.question.upVotesCount++;
            props.question.hasUpvoted = true;
        }
    } else {
        if (props.question.hasDownvoted) {
            props.question.downVotesCount--;
            props.question.hasDownvoted = false;
        } else {
            props.question.downVotesCount++;
            props.question.hasDownvoted = true;
        }
    }

    try {
        await questionComp.voteQuestion(props.question.qIdentifier, 'question', voteType);
    } catch (error) {
        // Revert changes on error
        if (voteType === 'up') {
            props.question.upVotesCount = props.question.hasUpvoted ? props.question.upVotesCount - 1 : props.question.upVotesCount + 1;
            props.question.hasUpvoted = !props.question.hasUpvoted;
        } else {
            props.question.downVotesCount = props.question.hasDownvoted ? props.question.downVotesCount - 1 : props.question.downVotesCount + 1;
            props.question.hasDownvoted = !props.question.hasDownvoted;
        }
    } finally {
        isVoting.value = false;
    }
};
</script>