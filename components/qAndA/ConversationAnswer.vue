<template>
  <div :class="{ 'border border-1 border-green-700': conversation.markedAsAnswer }"
       class="bg-muted text-muted-foreground rounded-lg flex p-4 gap-2 relative">
    <div class="flex gap-2">
      <div class="border-r-muted-foreground border-r pr-2 w-min flex flex-col items-center">
        <Avatar>
          <AvatarFallback>
            <Icon class="text-xl" name="mdi:account"></Icon>
          </AvatarFallback>
        </Avatar>
        <p class="text-pretty text-secondary-foreground">{{ conversation.author }}</p>
        <p v-if="isConversationAuthor" class="text-xs">Author</p>
      </div>
      <div class="flex-1">
        <p>Geantwortet vor {{ useTimeAgo(conversation.createdAt) }}</p>
        <span class="break-word break-all text-primary-foreground">
                {{ conversation.answer }}
              </span>
      </div>
    </div>
    <div class="ml-auto md:mt-auto flex items-center flex-col md:flex-row">
      <Button :class="{ 'text-green-400': conversation.hasUpvoted }" :disabled="isVoting || !user" size="icon"
              title="Upvote"
              variant="ghost"
              @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'up')">
        {{ conversation.upVotesCount }}
        <Icon name="mdi:thumb-up"></Icon>
      </Button>
      <Button :class="{ 'text-red-400': conversation.hasDownvoted }" :disabled="isVoting || !user" size="icon"
              title="Downvote"
              variant="ghost"
              @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'down')">
        {{ conversation.downVotesCount }}
        <Icon name="mdi:thumb-down"></Icon>
      </Button>
      <Button v-if="isAuthor" :disabled="isVoting || conversation.markedAsAnswer" size="icon"
              title="Als Antwort markieren"
              variant="ghost"
              @click.prevent="emits('vote', conversation.aIdentifier, 'answer', 'none')">
        <Icon class="text-emerald-500" name="mdi:check-bookmark"></Icon>
        <span class="sr-only">Als Antwort markieren</span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {type QuestionAnswerEndriched} from '~/types/questions';
import {useTimeAgo} from '@vueuse/core';

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