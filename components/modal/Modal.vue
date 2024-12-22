<template>
  <Transition name="scaleeffect">
    <main
        v-if="!!props"
        class="h-screen z-50 fixed top-0 bg-body inset-0 p-2 transition-all will-change-transform duration-700 overflow-auto">
      <div class="flex items-center top-0 sticky shadow backdrop-blur-lg bg-body/10">
        <Button aria-label="close" size="icon" variant="ghost" @click="close">
          <Icon class=" size-5" name="mdi:arrow-left"/>
        </Button>
        <h2 class="text-2xl font-bold">
          <slot name="title"></slot>
        </h2>
      </div>
      <slot name="default" v-bind="props"/>
    </main>
  </Transition>
</template>

<script generic="T" lang="ts" setup>
const props = defineModel<T>()
const emits = defineEmits(["close"])

const close = () => {
  emits("close");
}
</script>

<style scoped>
.scaleeffect-enter-active, .scaleeffect-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.scaleeffect-enter, .scaleeffect-leave-to, .fade-leave-active {
  transform: scale(0.8), translateY(50%);
  opacity: 0;
}

.scaleeffect-enter-to, .scaleeffect-leave {
  transform: scale(1), translateY(0);
  opacity: 1;
}
</style>