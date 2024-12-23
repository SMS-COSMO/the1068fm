<template>
  <ResizablePanelGroup id="songs-resizable" direction="horizontal">
    <template v-for="(panel, index) in panels" :key="panel">
      <ResizablePanel :id="`songs-resizable-resize-${index}`" :default-size="25">
        <ScrollArea class="h-[calc(100svh-4rem)]">
          <div class="sticky top-0 z-50 flex h-16 items-center border-b px-4" :class="panel.className">
            <Icon :name="panel.icon" size="17" class="mr-2" />
            <span class="text-sm font-semibold">{{ panel.label }}</span>
          </div>

          <TransitionGroup name="list" tag="ul" class="flex flex-col gap-3 p-4">
            <li v-for="song in songList?.filter((x) => x.state === panel.value)" :key="song.id">
              <SongCard :song type="songs" />
            </li>
          </TransitionGroup>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle :id="`songs-resizable-resize-${index}`" with-handle />
    </template>
    <ResizablePanel id="songs-resizable-panel-4" :default-size="25">
      <ScrollArea class="h-[calc(100svh-4rem)]">
        <div class="sticky top-0 flex h-16 items-center border-b bg-background px-4">
          <Tabs v-model="selectedTab" class="w-full" default-value="used">
            <TabsList class="grid grid-cols-2">
              <TabsTrigger value="used">
                入选
              </TabsTrigger>
              <TabsTrigger value="dropped">
                落选
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TransitionGroup v-if="selectedTab === 'used'" name="list" tag="ul" class="flex flex-col gap-3 p-4">
          <li v-for="song in songList?.filter((x) => x.state === 'used')" :key="song.id">
            <SongCard :song type="songs" />
          </li>
        </TransitionGroup>
        <TransitionGroup v-if="selectedTab === 'dropped'" name="list" tag="ul" class="flex flex-col gap-3 p-4">
          <li v-for="song in songList?.filter((x) => x.state === 'dropped')" :key="song.id">
            <SongCard :song type="songs" />
          </li>
        </TransitionGroup>
      </ScrollArea>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const { $trpc } = useNuxtApp();
const { data: songList, suspense } = useQuery({
  queryFn: () => $trpc.song.list.query(),
  queryKey: ['song.list'],
  refetchOnWindowFocus: false,
});
await suspense();

const panels = ref([
  {
    label: '审核中',
    value: 'pending',
    icon: 'lucide:clock',
    className: 'text-amber-700 dark:text-amber-200',
  },
  {
    label: '审核通过',
    value: 'approved',
    icon: 'lucide:thumbs-up',
    className: 'text-green-700 dark:text-green-200',
  },
  {
    label: '审核未通过',
    value: 'rejected',
    icon: 'lucide:thumbs-down',
    className: 'text-red-700 dark:text-red-200',
  },
]);

const selectedTab = ref<'used' | 'dropped'>('used');
</script>
