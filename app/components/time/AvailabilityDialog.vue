<template>
  <ClientOnly>
    <template #fallback>
      <slot />
    </template>
    <Dialog>
      <DialogTrigger>
        <slot />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            开放投稿时间段
          </DialogTitle>
        </DialogHeader>
        <ol>
          <template v-for="time in timeList" :key="time.id">
            <li>{{ getTimeDescription(time) }}</li>
          </template>
          <span v-if="!timeList?.length">
            暂无开放时间段～
          </span>
        </ol>
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const option = { locales: 'zh-CN' };
function getTimeDescription(time: RouterOutput['time']['listSafe'][0]) {
  if (time.repeats)
    return `${useDateFormat(time.startAt, '每ddd HH:mm', option).value} - ${useDateFormat(time.endAt, '每ddd HH:mm', option).value}`;
  else
    return `${useDateFormat(time.startAt, 'YYYY/MM/DD HH:mm', option).value} - ${useDateFormat(time.endAt, 'YYYY/MM/DD HH:mm', option).value}`;
}

const { $trpc } = useNuxtApp();
const { data: timeList, suspense } = useQuery({
  queryFn: () => $trpc.time.listSafe.query(),
  queryKey: ['time.listSafe'],
});
await suspense();
</script>
