<template>
  <div class="flex gap-1">
    <Badge v-if="state" class="flex items-center" :class="state.className" variant="outline">
      <Icon :name="state.icon" class="mr-1" />
      <span class="text-xs">{{ state.label }}</span>
    </Badge>
    <Badge v-if="song.state === 'rejected' && song.rejectMessage && !hideReason" variant="secondary">
      <span class="truncate font-normal">&nbsp;{{ song.rejectMessage }}</span>
    </Badge>
  </div>
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
    className: 'bg-amber-50 dark:bg-amber-200/50 border-amber-100 dark:border-amber-200 text-amber-700 dark:text-amber-200',
  },
  approved: {
    label: '审核通过',
    icon: 'lucide:thumbs-up',
    className: 'bg-green-50 dark:bg-green-200/50 border-green-100 dark:border-green-200 text-green-700 dark:text-green-200',
  },
  rejected: {
    label: '审核未通过',
    icon: 'lucide:thumbs-down',
    className: 'bg-red-50 dark:bg-red-200/50 border-red-100 dark:border-red-200 text-red-700 dark:text-red-200',
  },
  used: {
    label: '入选',
    icon: 'lucide:check',
    className: 'bg-green-50 dark:bg-green-200/50 border-green-100 dark:border-green-200 text-green-700 dark:text-green-200',
  },
  dropped: {
    label: '落选',
    icon: 'lucide:x',
    className: 'bg-amber-50 dark:bg-amber-200/50 border-amber-100 dark:border-amber-200 text-amber-700 dark:text-amber-200',
  },
};

const state = computed(() => song.state ? states[song.state] : undefined);
</script>
