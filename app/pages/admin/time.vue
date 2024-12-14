<template>
  <ResizablePanelGroup id="time-resizable" direction="horizontal" @layout="layout = $event">
    <ResizablePanel id="time-resizable-panel-1" :default-size="layout[0]">
      <ScrollArea class="h-[calc(100svh-4rem)] p-4">
        <div class="flex flex-col gap-4">
          <TransitionGroup name="list" tag="ul" class="flex flex-col gap-4">
            <li v-for="time in timeList" :key="time.id">
              <AdminTimeCard
                :time
                :selected="selectedTime === time"
                @click="rightPanel = 'edit'; selectedTime = time;"
              />
            </li>
          </TransitionGroup>

          <Button variant="outline" class="h-20 w-full rounded-lg" @click="rightPanel = 'create'">
            <Icon name="lucide:plus" size="18" />
          </Button>
        </div>
      </ScrollArea>
    </ResizablePanel>
    <ResizableHandle id="time-resizable-resize-1" with-handle />
    <ResizablePanel id="time-resizable-panel-2" :default-size="layout[1]">
      <ScrollArea class="h-[calc(100svh-4rem)] p-4">
        <AdminTimeCreateForm v-if="rightPanel === 'create'" />
        <AdminTimeEditForm
          v-for="time in timeList?.filter(x => rightPanel === 'edit' && selectedTime?.id === x.id)"
          :key="time.id"
          :time
        />
      </ScrollArea>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

definePageMeta({
  layout: 'admin',
});

const { $trpc } = useNuxtApp();
const layout = useCookie<number[]>('time-resizable:layout', {
  default: () => [35, 65],
});

const rightPanel = ref<'unset' | 'create' | 'edit'>('unset');

const { data: timeList, suspense: timeListSuspense } = useQuery({
  queryFn: () => $trpc.time.list.query(),
  queryKey: ['time.list'],
});
await timeListSuspense();

const selectedTime = ref<RouterOutput['time']['list'][0]>();
</script>
