<template>
    <Transition name="scaleeffect">
        <main
            class="h-screen z-50 fixed top-0 bg-body inset-0 p-2 transition-all will-change-transform duration-700"
            v-if="!!props">
            <div class="flex items-center">
                <Button variant="ghost" size="icon" @click="close" aria-label="close">
                    <Icon name="mdi:arrow-left" class=" size-5" />
                </Button>
                <h2 class="text-2xl font-bold"><slot name="title"></slot></h2>
            </div>
            <slot name="default" v-bind="props" />
        </main>
    </Transition>
</template>

<script setup lang="ts" generic="T">
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