<script setup lang="ts">
import type { TTime, TTimeList } from '~/types';

const { $api } = useNuxtApp();
const timeList = ref<TTimeList>();
const option = { locales: 'zh-CN' };
function getTimeDescription(time: TTime) {
  if (time.repeats)
    return `${useDateFormat(time.startAt, '每ddd HH:mm', option).value} - ${useDateFormat(time.endAt, '每ddd HH:mm', option).value}`;
  else
    return `${useDateFormat(time.startAt, 'YYYY/MM/DD HH:mm', option).value} - ${useDateFormat(time.endAt, 'YYYY/MM/DD HH:mm', option).value}`;
}
try {
  timeList.value = (await $api.time.list.query())
    .filter(time => time.isActive === true)
    .sort((a, b) => {
      if (a.repeats === b.repeats)
        return 0; // if both have the same repeats value, don't change their order
      return a.repeats ? -1 : 1; // if a.repeats is true, it will come before b; otherwise, after b
    });
} catch (err) {
  useErrorHandler(err);
}
</script>

<template>
  <UiDialog>
    <UiDialogTrigger>
      <slot />
    </UiDialogTrigger>
    <UiDialogContent class="w-[92vw] rounded-md">
      <UiDialogHeader>
        <UiDialogTitle class="text-xl font-bold text-start">
          开放投稿时间段
        </UiDialogTitle>
      </UiDialogHeader>
      <UiScrollArea class="h-auto">
        <div class="prose">
          <ol>
            <template v-for="time in timeList" :key="time.id">
              <li>{{ getTimeDescription(time) }}</li>
            </template>
          </ol>
        </div>
      </UiScrollArea>
      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton type="button" variant="secondary" class="ml-auto px-6">
            好的
          </UiButton>
        </UiDialogClose>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
