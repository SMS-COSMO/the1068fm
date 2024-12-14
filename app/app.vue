<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <Toaster position="top-center" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import 'v-calendar/style.css';

useHeadSafe({
  titleTemplate: (title?: string) => !title ? 'the1068fm 点歌系统' : `${title} | the1068fm 点歌系统`,
  meta: [{ name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' }],
});
</script>

<style>
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
</style>
