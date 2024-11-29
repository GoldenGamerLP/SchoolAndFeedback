<template>
    <div class="bg-muted rounded-lg border border-primary flex p-4 gap-2 mb-8 shadow">
        <div class="border-r border-r-muted-foreground pr-2 w-min flex flex-col items-center">
            <Avatar>
                <AvatarFallback>
                    <Icon name="mdi:account" class="text-xl"></Icon>
                </AvatarFallback>
            </Avatar>
            <p class="text-pretty">{{ conversation.author }}</p>
        </div>
        <div class="flex-1">
            <ol class="flex gap-2">
                <Badge v-for="tag in conversation.tags" :key="tag">{{ tag }}</Badge>
            </ol>
            <h1 class="text-xl font-bold">{{ conversation.title }}</h1>
            <p class="max-w-5xl text-pretty">
                {{ conversation.description }}
            </p>
            <div class="flex">
                <button
                    class="rounded-xl text-green-400 bg-green-500/10 border-2 border-green-600 flex items-center gap-2 py-1 px-2 text-sm mt-4"
                    v-if="conversation.answerId" @click="emits('goToAnswer', conversation.answerId)">
                    <Icon name="mdi:check-all"></Icon>
                    Gehe zu markierte Antwort
                </button>
                <Button size="icon" variant="secondary" class="ml-auto" :disabled="isVoting || !user"
                    :class="{ 'text-green-400': conversation.hasUpvoted }"
                    @click.prevent="emits('vote', conversation.qIdentifier, 'question', 'up')">
                    {{ conversation.upVotesCount }}
                    <Icon name="mdi:thumb-up"></Icon>
                </Button>
                <Button size="icon" variant="secondary" class="" :disabled="isVoting || !user"
                    :class="{ 'text-red-400': conversation.hasDownvoted }"
                    @click.prevent="emits('vote', conversation.qIdentifier, 'question', 'down')">
                    {{ conversation.downVotesCount }}
                    <Icon name="mdi:thumb-down"></Icon>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type QuestionEnriched } from '~/types/questions';

const user = useUser();
const emits = defineEmits(['goToAnswer', 'vote']);

defineProps<{
    conversation: QuestionEnriched;
    isVoting: boolean;
}>();
</script>