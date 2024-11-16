<template>
  <ResizablePanelGroup direction="horizontal" class="min-h-[calc(100svh-4rem)]">
    <ResizablePanel :default-size="35" class="py-4 gap-4 flex flex-col">
      <TransitionGroup name="list" tag="ul" class="gap-4 flex flex-col">
        <li v-for="time in timeList" :key="time.id">
          <AdminTimeCard
            :time
            :selected="selectedTime === time"
            @click="rightPanel = 'edit'; selectedTime = time;"
          />
        </li>
      </TransitionGroup>

      <Button variant="outline" class="h-20 rounded-lg w-full" @click="rightPanel = 'create'">
        <Icon name="lucide:plus" size="18" />
      </Button>
    </ResizablePanel>
    <ResizableHandle class="mx-4" with-handle />
    <ResizablePanel :default-size="65" class="py-4">
      <AdminTimeCreateForm v-if="rightPanel === 'create'" />
      <AdminTimeEditForm
        v-for="time in timeList?.filter(x => rightPanel === 'edit' && selectedTime?.id === x.id)"
        :key="time.id"
        :time
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

definePageMeta({
  layout: 'admin',
});

const { $trpc } = useNuxtApp();

const rightPanel = ref<'unset' | 'create' | 'edit'>('unset');

const { data: timeList, suspense: timeListSuspense } = useQuery({
  queryFn: () => $trpc.time.list.query(),
  queryKey: ['time.list'],
});
await timeListSuspense();

const selectedTime = ref<RouterOutput['time']['list'][0]>();
</script>
