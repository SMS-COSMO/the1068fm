<script setup lang="ts">
import type { TTime } from '~/types';

const props = withDefaults(defineProps<{
  time: TTime;
  selected?: boolean;
}>(), {
  selected: false,
});
const emit = defineEmits<{ (event: 'editSuccess'): void }>();
const { $api } = useNuxtApp();
const time = props.time;
const dayString = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

async function active() {
  try {
    await $api.time.modifyActive.mutate({ id: time.id, isActive: !time.isActive });
    time.isActive = !time.isActive;
    emit('editSuccess');
  } catch (err) {
    useErrorHandler(err);
  }
}
</script>

<template>
  <UiCard :class="`mb-3 ${selected ? 'bg-slate-100' : ''} transition-all ease-in-out`">
    <UiCardContent class="p-4">
      <span class="text-secondary-foreground flex flex-row">
        <UiBadge variant="secondary">
          {{ time.name }}
        </UiBadge>
      </span>
      <div class="flex flex-row my-1">
        <span class="px-5 lg:px-10 pt-2">
          <div v-if="time.repeats" class="text-2xl font-bold text-center">
            {{ `${dayString[time.startAt.getDay()]}` }}
          </div>
          <div v-else class="text-2xl font-bold text-center">
            {{ `${time.startAt.getMonth() + 1}-${time.startAt.getDate()}` }}
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
            {{ `${time.endAt.getMonth() + 1}-${time.endAt.getDate()}` }}
          </div>
          <div class="text-lg text-center">
            {{ `${time.endAt.getHours().toString().padStart(2, '0')}:${time.endAt.getMinutes().toString().padStart(2, '0')}` }}
          </div>
        </span>
      </div>
      <div class="flex">
        <UiSwitch class="ml-auto" :checked="time.isActive" @update:checked="active" />
      </div>
    </UiCardContent>
  </UiCard>
</template>
