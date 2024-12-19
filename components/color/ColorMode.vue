<script lang="ts" setup>
const colorMode = useColorMode()
let mode = colorMode.value;

const toggleColorMode = () => {
  //When light => dark
  //When dark => light
  if (mode === 'light') {
    colorMode.preference = 'dark';
    mode = 'dark';
  } else {
    colorMode.preference = 'light';
    mode = 'light';
  }

}
</script>

<template>
  <Button class="w-full overflow-hidden" variant="ghost" @click="toggleColorMode" @click.stop.prevent>
    <Transition name="fade">
      <template v-if="colorMode.value === 'light'">
        <span>
          <Icon name="mdi:moon-waning-crescent"/> Wechsel zu Dunkler Modus
        </span>
      </template>
      <template v-else>
        <span>
          <Icon name="mdi:weather-sunny"/> Wechsel zu Heller Modus
        </span>
      </template>
    </Transition>
  </Button>
</template>

<style scoped>
/* Element leaving - slides right and fades */
.fade-leave-active {
  transition: all 0.35s ease-out;
  position: absolute;
}

.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Element entering - slides from left */
.fade-enter-active {
  transition: all 0.35s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>