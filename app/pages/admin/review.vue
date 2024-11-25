<template>
  <ResizablePanelGroup id="review-resizable" direction="horizontal" @layout="layout = $event">
    <ResizablePanel id="review-resizable-panel-1" :default-size="layout[0]">
      <ScrollArea class="h-[calc(100svh-4rem)] p-4">
        <TransitionGroup name="list" tag="ul" class="gap-3 flex flex-col">
          <li v-for="song in songList" :key="song.id">
            <AdminSongCard
              :song
              :selected="selectedSong === song"
              @click="selectedSong = song"
            />
          </li>
        </TransitionGroup>
      </ScrollArea>
    </ResizablePanel>
    <ResizableHandle id="review-resizable-resize-1" with-handle />
    <ResizablePanel id="review-resizable-panel-2" :default-size="layout[1]">
      <ScrollArea class="h-[calc(100svh-4rem)] p-4">
        right
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
const layout = useCookie<number[]>('review-resizable:layout', {
  default: () => [35, 65],
});

const { data: songList, suspense } = useQuery({
  queryFn: () => $trpc.song.listReview.query(),
  queryKey: ['song.listReview'],
  refetchOnWindowFocus: false,
});
await suspense();

const selectedSong = ref<RouterOutput['song']['listReview'][0] | undefined>(songList.value?.[0]);
</script>
