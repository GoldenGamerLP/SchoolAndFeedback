<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Slide Right Animation */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(120px);
}

.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(120px);
}

/* Slide Left Animation */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-120px);
}

.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-120px);
}

/* Shared transition properties */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s ease-out;
  overflow: hidden;
  width: 100%;
  will-change: transform, opacity;
}
</style>
