<template>
  <li>
    <Card>
      <CardHeader>
        <CardTitle>
          <NuxtLink
              :to="{name: 'schools-schoolnumber-threads-id', params: {schoolnumber: schoolId, id: props.question.qIdentifier}}">
            {{ props.question.title }}
          </NuxtLink>
        </CardTitle>
        <CardDescription class="flex items-center">
          <Icon name="mdi:tag" class="mr-2"></Icon>
          <ol class="flex space-x-2">
            <li v-for="tag in props.question.tags" :key="tag">{{ tag }}</li>
          </ol>
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col">
        <span>
            <Icon name="mdi:account"></Icon>
          {{ props.question.author }}
         </span>
        <span>
            <Icon name="mdi:clock-time-four-outline"></Icon>
            Am {{
            useDateFormat(props.question.createdAt, 'dddd DD:MM:YYYY, HH:MM', {
              locales:
                  'de-DE'
            })
          }} Uhr
          </span>
      </CardContent>
      <CardFooter>
        <ol class="flex gap-2 text-muted-foreground">
          <li class="flex items-center gap-2" :class="{ 'text-green-400': props.question.hasUpvoted }">
            <Icon name="mdi:thumb-up"></Icon>
            {{ props.question.upVotesCount }}
          </li>
          <li class="flex items-center">
            <Icon name="mdi:dot"></Icon>
          </li>
          <li class="flex items-center gap-2" :class="{ 'text-red-400': props.question.hasDownvoted }">
            <Icon name="mdi:thumb-down"></Icon>
            {{ props.question.downVotesCount }}
          </li>
          <li class="flex items-center">
            <Icon name="mdi:dot"></Icon>
          </li>
          <li class="flex items-center gap-2">
            <Icon name="mdi:comment"></Icon>
            {{ props.question.conversationsCount }}
          </li>
          <template v-if="props.question.answerId">
            <li class="flex items-center">
              <Icon name="mdi:dot"></Icon>
            </li>
            <li class="flex items-center gap-2">
              <NuxtLink :to="{name: 'schools-schoolnumber-threads-id', params: {schoolnumber: schoolId, id: props.question.qIdentifier}, hash: `#answer-${props.question.answerId}`}">
                <Icon name="mdi:check-all" class="text-green-400"></Icon>
                Beantwortet (Klick um zur Antwort zu springen)
              </NuxtLink>
            </li>
          </template>
        </ol>
      </CardFooter>
    </Card>
  </li>
</template>

<script setup lang="ts">
import useQuestion from '~/composables/question';
import {type QuestionEnriched} from '~/types/questions';
import {useDateFormat} from "@vueuse/core";

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