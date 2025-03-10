<template>
  <div class="container max-w-screen-lg select-none divide-y px-0 md:border-x">
    <div class="flex items-center gap-2 pl-5 font-bold">
      <Button size="icon" variant="outline" @click="navigateTo('/')">
        <Icon name="lucide:chevron-left" />
      </Button>
      <span class="md:text-xl">数据统计</span>
      <div class="ml-auto flex">
        <div class="flex flex-1 flex-col justify-center gap-1 border-l px-6 py-4 text-left sm:px-8 sm:py-6">
          <span class="text-xs text-muted-foreground">累计投稿</span>
          <span class="text-lg font-bold leading-none sm:text-3xl">{{ countData?.songCount }}</span>
        </div>
        <div class="flex flex-1 flex-col justify-center gap-1 border-l px-6 py-4 text-left sm:px-8 sm:py-6">
          <span class="text-xs text-muted-foreground">用户数目</span>
          <span class="text-lg font-bold leading-none sm:text-3xl">{{ countData?.userCount }}</span>
        </div>
      </div>
    </div>
    <div>
      <CardHeader>
        <CardTitle>
          <span class="text-muted-foreground">#1</span> 每周投稿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-2 overflow-x-auto">
          <div v-for="(week, i) of weekData" :key="week.date" class="flex flex-col gap-2">
            <div class="relative flex h-[500px] w-8 flex-col justify-end md:h-[600px] md:w-16">
              <div
                v-if="week.count"
                :style="{ height: `${(week.count ?? 0) / weekMax * 100}%` }"
                class="flex justify-center rounded text-xs text-white"
                :class="[i % 2 === 0 ? 'bg-green-800' : 'bg-green-700']"
              >
                <span class="py-0.5 font-mono md:py-2">{{ week.count }}</span>
              </div>
            </div>
            <div class="self-center font-mono text-xs text-muted-foreground [writing-mode:vertical-lr] md:[writing-mode:lr]">
              {{ week.date }}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
    <div>
      <CardHeader>
        <CardTitle>
          <span class="text-muted-foreground">#2</span> 歌手统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[500px]" type="always">
          <div class="flex flex-col gap-2">
            <div v-for="(singer, i) of singerData" :key="singer.singerName" class="items-center gap-3 md:flex">
              <div class="truncate text-xs text-muted-foreground md:w-40 md:text-right">
                {{ singer.singerName }}
              </div>
              <div class="flex w-full">
                <div
                  v-if="singer.count"
                  :style="{ width: `${(singer.count ?? 0) / singerMax * 100}%` }"
                  class="flex h-6 items-center rounded text-xs text-white"
                  :class="[
                    (singer.count ?? 0) === 0 && 'rounded-r',
                    i % 2 === 0 ? 'bg-blue-600' : 'bg-blue-500',
                  ]"
                >
                  <span class="px-0.5 font-mono md:px-2">{{ singer.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div class="mt-4 text-center text-xs text-muted-foreground">
          * 部分歌曲无搜索结果，无法确认歌手
        </div>
      </CardContent>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();
const { data: weekData, suspense: weekDataSuspense } = useQuery({
  queryFn: () => $trpc.stats.song.query(),
  queryKey: ['stats.song'],
  refetchIntervalInBackground: false,
});
await weekDataSuspense();
const weekMax = Math.max(...weekData.value?.map(week => week.count) ?? []);

const { data: singerData, suspense: singerDataSuspense } = useQuery({
  queryFn: () => $trpc.stats.singer.query(),
  queryKey: ['stats.singer'],
  refetchIntervalInBackground: false,
});
await singerDataSuspense();
const singerMax = Math.max(...singerData.value?.map(singer => singer.count) ?? []);

const { data: countData, suspense: countDataSuspense } = useQuery({
  queryFn: () => $trpc.stats.count.query(),
  queryKey: ['stats.count'],
  refetchIntervalInBackground: false,
});
await countDataSuspense();
</script>
