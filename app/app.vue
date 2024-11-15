<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <Toaster position="top-center" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHeadSafe({
  titleTemplate: (title?: string) => !title ? 'the1068fm 点歌系统' : `${title} | the1068fm 点歌系统`,
  meta: [{ name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' }],
});
</script>
