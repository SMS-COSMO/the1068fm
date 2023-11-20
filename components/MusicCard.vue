<template>
  <UiCard class="mb-4">
    <UiCardHeader>
      <UiCardTitle>
        {{ title }}
      </UiCardTitle>
      <UiCardDescription>
        by {{ creator }}
      </UiCardDescription>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  creator: string;
}>();
</script>