<template>
  <div
    class="h-auto p-4 w-full border rounded-lg shadow-sm hover:bg-muted transition-colors cursor-pointer"
    :class="{ 'bg-muted/60': selected }"
  >
    <div class="text-secondary-foreground flex flex-row justify-between">
      <Badge variant="secondary">
        {{ time.name }}
      </Badge>
      <Switch :checked="time.isActive" @update:checked="mutate({ id: time.id, isActive: !time.isActive })" />
    </div>
    <div class="flex flex-row mb-6 mt-4">
      <span class="px-5 lg:px-10 pt-2">
        <div v-if="time.repeats" class="text-2xl font-bold text-center">
          {{ `${dayString[time.startAt.getDay()]}` }}
        </div>
        <div v-else class="text-2xl font-bold text-center">
          {{ time.startAt.toLocaleDateString('zh-CN').replaceAll('/', '-') }}
        </div>
        <div class="text-lg text-center">
          {{ `${time.startAt.getHours().toString().padStart(2, '0')}:${time.startAt.getMinutes().toString().padStart(2, '0')}` }}
        </div>
      </span>
      <span class="flex-grow flex">
        <div class="w-[50px] h-[2px] bg-slate-200 mx-auto self-center rounded-full" />
      </span>
      <span class="px-5 lg:px-10 pt-2">
        <div v-if="time.repeats" class="text-2xl font-bold text-center">
          {{ `${dayString[time.endAt.getDay()]}` }}
        </div>
        <div v-else class="text-2xl font-bold text-center">
          {{ time.endAt.toLocaleDateString('zh-CN').replaceAll('/', '-') }}
        </div>
        <div class="text-lg text-center">
          {{ `${time.endAt.getHours().toString().padStart(2, '0')}:${time.endAt.getMinutes().toString().padStart(2, '0')}` }}
        </div>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const { selected = false } = defineProps<{
  selected?: boolean;
  time: RouterOutput['time']['list'][0];
}>();

const { $trpc } = useNuxtApp();

const dayString = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: $trpc.time.modifyActive.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['time.list'] });
    queryClient.invalidateQueries({ queryKey: ['time.currently'] });
  },
  onError: err => useErrorHandler(err),
});
</script>
