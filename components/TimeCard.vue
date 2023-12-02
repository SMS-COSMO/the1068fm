<template>
  <UiCard :class="`mb-3 ${selected ? 'bg-slate-100' : ''} transition-all ease-in-out`">
    <UiCardContent class="p-4">
      <span class="text-secondary-foreground flex flex-row">
        <UiBadge variant="secondary">
          {{ time.name }}
        </UiBadge>
      </span>
      <div class="flex flex-row my-1">
        <span class="px-10 pt-2">
          <div class="text-2xl font-bold text-center" v-if="time.repeats">
            {{ `${dayString[time.startAt.getDay()]}` }}
          </div>
          <div class="text-2xl font-bold text-center" v-else="time.repeats">
            {{ `${time.startAt.getMonth() + 1}-${time.startAt.getDate()}` }}
          </div>
          <div class="text-lg text-center">
            {{ `${time.startAt.getHours().toString().padStart(2, '0')}:${time.startAt.getMinutes().toString().padStart(2,
              '0')}` }}
          </div>
        </span>
        <span class="flex-grow flex">
          <div class="w-1/2 h-[2px] bg-slate-200 mx-auto self-center rounded-full"></div>
        </span>
        <span class="px-10 pt-2">
          <div class="text-2xl font-bold text-center" v-if="time.repeats">
            {{ `${dayString[time.endAt.getDay()]}` }}
          </div>
          <div class="text-2xl font-bold text-center" v-else="time.repeats">
            {{ `${time.endAt.getMonth() + 1}-${time.endAt.getDate()}` }}
          </div>
          <div class="text-lg text-center">
            {{ `${time.endAt.getHours().toString().padStart(2, '0')}:${time.endAt.getMinutes().toString().padStart(2,
              '0')}` }}
          </div>
        </span>
      </div>
      <div class="flex">
        <UiSwitch class="ml-auto" :checked="time.isActive" @update:checked="active"></UiSwitch>
      </div>
    </UiCardContent>
  </UiCard>
</template>

<script setup lang="ts">
import type { TTime } from '~/types';
const { $api } = useNuxtApp();

const dayString = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const props = withDefaults(defineProps<{
  time: TTime;
  selected?: boolean;
}>(), {
  selected: false,
});

const emit = defineEmits<{ (event: 'editSuccess'): void }>();

const active = async () => {
  try {
    await $api.time.modifyActive.mutate({ id: props.time.id, isActive: !props.time.isActive });
    props.time.isActive = !props.time.isActive;
    emit('editSuccess')
  } catch (err) {
    useErrorHandler(err);
  }
};
</script>