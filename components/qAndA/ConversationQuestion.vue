<template>
  <div class="bg-muted rounded-lg border border-primary flex p-4 gap-2 mb-8 shadow">
    <div class="border-r border-r-muted-foreground pr-2 w-min flex flex-col items-center">
      <Avatar>
        <AvatarFallback>
          <Icon class="text-xl" name="mdi:account"></Icon>
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
      <Button v-if="conversation.answerId" class="mt-2 md:w-auto w-full"
              @click="emits('goToAnswer', conversation.answerId) ">
        <Icon class="mr-2" name="mdi:format-list-checks"></Icon>
        Antwort ansehen
      </Button>
      <div class="mt-4">
        <Button :class="{ 'text-green-400': conversation.hasUpvoted }" :disabled="isVoting || !user" class="ml-auto"
                variant="ghost"
                @click.prevent="emits('vote', conversation.qIdentifier, 'question', 'up')">
          {{ conversation.upVotesCount }}
          <Icon name="mdi:thumb-up"></Icon>
        </Button>
        <Button :class="{ 'text-red-400': conversation.hasDownvoted }" :disabled="isVoting || !user" class=""
                variant="secondary"
                @click.prevent="emits('vote', conversation.qIdentifier, 'question', 'down')">
          {{ conversation.downVotesCount }}
          <Icon name="mdi:thumb-down"></Icon>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {type QuestionEnriched} from '~/types/questions';

const user = useUser();
const emits = defineEmits(['goToAnswer', 'vote']);

defineProps<{
  conversation: QuestionEnriched;
  isVoting: boolean;
}>();
</script>