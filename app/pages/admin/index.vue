<template>
  admin
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
const userStore = useUserStore();

if (!userStore.permissions.includes('admin'))
  navigateTo('/');
</script>
