<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <Icon name="lucide:panel-left" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { useSidebar } from './utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { toggleSidebar } = useSidebar();
</script>
