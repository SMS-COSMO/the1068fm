<template>
  <div
    class="h-auto w-full cursor-pointer rounded-lg border p-4 shadow-sm transition-colors hover:bg-muted"
    :class="{ 'bg-muted/60': selected }"
  >
    <div class="flex flex-row justify-between text-secondary-foreground">
      <Badge variant="secondary">
        {{ time.name }}
      </Badge>
      <Switch :checked="time.isActive" @update:checked="mutate({ id: time.id, isActive: !time.isActive })" />
    </div>
    <div class="mb-6 mt-4 flex flex-row">
      <span class="px-5 pt-2 lg:px-10">
        <div v-if="time.repeats" class="text-center text-2xl font-bold">
          {{ `${dayString[time.startAt.getDay()]}` }}
        </div>
        <div v-else class="text-center text-2xl font-bold">
          {{ time.startAt.toLocaleDateString('zh-CN').replaceAll('/', '-') }}
        </div>
        <div class="text-center text-lg">
          {{ `${time.startAt.getHours().toString().padStart(2, '0')}:${time.startAt.getMinutes().toString().padStart(2, '0')}` }}
        </div>
      </span>
      <span class="flex flex-grow">
        <div class="mx-auto h-[2px] w-[50px] self-center rounded-full bg-slate-200" />
      </span>
      <span class="px-5 pt-2 lg:px-10">
        <div v-if="time.repeats" class="text-center text-2xl font-bold">
          {{ `${dayString[time.endAt.getDay()]}` }}
        </div>
        <div v-else class="text-center text-2xl font-bold">
          {{ time.endAt.toLocaleDateString('zh-CN').replaceAll('/', '-') }}
        </div>
        <div class="text-center text-lg">
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
