<script setup lang="ts">
import { ConfigProvider } from 'radix-vue';

const useIdFunction = () => useId();
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <ClientOnly>
      <Toaster position="top-center" rich-colors />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.15s;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translate(100px, 0);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translate(-100px, 0);
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.1s;
}

.slide-up-leave-to,
.slide-up-enter-from {
  opacity: 0;
  transform: translate(0, -100px);
}

.slide-down-leave-to,
.slide-down-enter-from {
  opacity: 0;
  transform: translate(0, 100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}

/* List animation */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
  width: 100%;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
