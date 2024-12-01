<template>
    <div class="bg-muted text-muted-foreground rounded-lg flex p-4 gap-2 relative"
        :class="{ 'border border-1 border-green-700': conversation.markedAsAnswer }">
        <div class="flex gap-2">
            <div class="border-r-muted-foreground border-r pr-2 w-min flex flex-col items-center">
                <Avatar>
                    <AvatarFallback>
                        <Icon name="mdi:account" class="text-xl"></Icon>
                    </AvatarFallback>
                </Avatar>
                <p class="text-pretty text-secondary-foreground">{{ conversation.author }}</p>
                <p v-if="isConversationAuthor" class="text-xs">Author</p>
            </div>
            <div class="flex-1">
                <p>Geantwortet vor {{ useTimeAgo(conversation.createdAt) }}</p>
                <p class="max-w-5xl text-pretty text-foreground/80">
                    {{ conversation.answer }}
                </p>
            </div>
        </div>
        <div class="ml-auto md:mt-auto flex items-center flex-col md:flex-row">
            <Button size="icon" variant="ghost" :disabled="isVoting || !user"
                :class="{ 'text-green-400': conversation.hasUpvoted }"
                title="Upvote"
                @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'up')">
                {{ conversation.upVotesCount }}
                <Icon name="mdi:thumb-up"></Icon>
            </Button>
            <Button size="icon" variant="ghost" :disabled="isVoting || !user"
                :class="{ 'text-red-400': conversation.hasDownvoted }"
                title="Downvote"
                @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'down')">
                {{ conversation.downVotesCount }}
                <Icon name="mdi:thumb-down"></Icon>
            </Button>
            <Button variant="ghost" v-if="isAuthor" size="icon"
                :disabled="isVoting || conversation.markedAsAnswer"
                title="Als Antwort markieren"
                @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'none')">
                <Icon name="mdi:check-bookmark" class="text-emerald-500"></Icon>
                <span class="sr-only">Als Antwort markieren</span>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type QuestionAnswerEndriched } from '~/types/questions';
import { useTimeAgo } from '@vueuse/core';

const emits = defineEmits(['vote']);
const user = useUser();

const props = defineProps<{
    conversation: QuestionAnswerEndriched;
    isVoting: boolean;
    questionAuthorId: string;
}>();

const isAuthor = computed(() => user.value?.id === props.questionAuthorId);

const isConversationAuthor = computed(() => props.questionAuthorId === props.conversation.authorId);
</script>