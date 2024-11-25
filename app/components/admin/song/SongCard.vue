<template>
  <div
    class="h-auto p-4 w-full border rounded-lg shadow-sm hover:bg-muted transition-colors cursor-pointer"
    :class="{ 'bg-muted': selected }"
  >
    <CardTitle>
      {{ song.name }}
    </CardTitle>
    <CardDescription>
      {{ song.creator }}
    </CardDescription>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const { selected = false } = defineProps<{
  selected?: boolean;
  song: RouterOutput['song']['listReview'][0];
}>();
</script>
