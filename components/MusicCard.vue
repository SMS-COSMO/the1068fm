<template>
  <UiCard :class="compact ? 'mb-3' : 'mb-4'">
    <UiCardHeader :class="compact ? 'p-4' : ''">
      <UiCardTitle :class="compact ? 'text-lg' : ''">
        {{ title }}
      </UiCardTitle>
      <UiCardDescription>
        by {{ creator }}
      </UiCardDescription>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  creator: string;
  compact?: boolean;
}>(), {
  compact: false,
});
</script>