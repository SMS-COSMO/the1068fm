<template>
  <Badge v-if="state" variant="outline" class="flex items-center" :class="state.className">
    <Icon :name="state.icon" class="mr-1" />
    <span>{{ state.label }}</span>
    <span v-if="song.rejectMessage && !hideReason" class="text-[10px] font-normal max-w-16 truncate">&nbsp;{{ song.rejectMessage }}</span>
  </Badge>
</template>

<script setup lang="ts">
import type { RouterOutput, TSongState } from '~~/types';

const { song, hideReason = false } = defineProps<{
  song: Partial<RouterOutput['song']['listMine'][0]>;
  hideReason?: boolean;
}>();

const states: Record<
  TSongState,
  {
    label: string;
    icon: string;
    className: string;
  }
> = {
  pending: {
    label: '审核中',
    icon: 'lucide:clock',
    className: 'bg-amber-50 border-amber-100 text-amber-700',
  },
  approved: {
    label: '通过',
    icon: 'lucide:check',
    className: 'bg-green-50 border-green-100 text-green-700',
  },
  rejected: {
    label: '未通过',
    icon: 'lucide:x',
    className: 'bg-red-50 border-red-100 text-red-700',
  },
};

const state = computed(() => song.state ? states[song.state] : undefined);
</script>
