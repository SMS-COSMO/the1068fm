<template>
  <div class="w-[calc(100vw-16rem)] overflow-x-auto">
    <div class="flex w-max">
      <div
        v-for="day in arrangementList"
        :key="day.date"
        class="w-[400px] border-r"
      >
        <ScrollArea class="h-[calc(100svh-4rem)]">
          <div class="h-16 px-4 border-b sticky top-0 bg-background flex items-center z-50">
            <span class="font-semibold text-sm">{{ day.date }}</span>
            <Button variant="outline" size="sm" class="ml-auto" @click="copySongInfo(day)">
              <Icon name="lucide:clipboard" class="mr-1" />
              复制
            </Button>
          </div>
          <ul class="p-4 gap-3 flex flex-col">
            <li v-for="song in day.songs" :key="song.id">
              <SongCard :song />
            </li>
          </ul>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

definePageMeta({
  layout: 'admin',
});

const { $trpc } = useNuxtApp();
const { data: arrangementList, suspense } = useQuery({
  queryFn: () => $trpc.arrangements.list.query(),
  queryKey: ['arrangements.list'],
});
await suspense();

const { copy: useCopy } = useClipboard({ legacy: true });
async function copySongInfo(day: RouterOutput['arrangements']['list'][0]) {
  if (!day.songs.length) {
    toast.error('排歌表为空');
    return;
  }

  let info = '';
  for (const song of day.songs)
    info += `《${song.name}》 ${song.creator}\n`;

  try {
    await useCopy(info.trim());
    toast.success('复制成功');
  } catch (e: any) {
    if (e.message)
      toast.error(e.message);
    else
      toast.error(e.toString());
  }
}
</script>
