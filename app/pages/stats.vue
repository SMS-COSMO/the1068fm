<template>
  <div class="container max-w-screen-lg select-none divide-y px-0 md:border-x">
    <div class="p-5">
      <h1 class="flex items-center gap-2 font-bold">
        <LogosThe1068fm class="inline h-6 w-min" />
        <span>数据回顾（九月 & 十月）</span>
        <Button size="icon" variant="outline" class="ml-auto" @click="navigateTo('/')">
          <Icon name="lucide:chevron-left" />
        </Button>
      </h1>
    </div>
    <div>
      <CardHeader>
        <CardTitle>
          <span class="text-muted-foreground">#1</span> 每周投稿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="mb-6 flex justify-end gap-2">
          <div class="rounded bg-green-900 px-2 py-1 text-sm text-white">
            真名投稿 <code>571</code>
          </div>
          <div class="rounded bg-green-500 px-2 py-1 text-sm text-white">
            化名投稿 <code>79</code>
          </div>
          <div class="flex items-center rounded px-2 py-1 text-sm">
            <div class="mb-1 mr-1 size-2 rounded-full border-2 border-rose-400" />
            <span>
              比例
            </span>
          </div>
        </div>
        <div class="grid grid-cols-9 gap-2">
          <div v-for="week of weekData" :key="week.date" class="flex flex-col gap-2">
            <div class="relative flex h-[500px] flex-col justify-end md:h-[600px]">
              <div class="absolute flex w-full flex-col items-center" :style="{ bottom: `${getRatio(week.count[1], week.count[0])}%` }">
                <div class="size-2 rounded-full border-2 border-rose-400" />
                <div
                  class="font-mono text-[10px]"
                  :class="[getRatio(week.count[1], week.count[0]) > ((week.count[0] ?? 0) + (week.count[1] ?? 0)) / 2 ? 'text-primary' : 'text-white']"
                >
                  {{ `${getRatio(week.count[1], week.count[0]).toFixed(0)}%` }}
                </div>
              </div>
              <div
                v-if="week.count[1]"
                :style="{ height: `${(week.count[1] ?? 0) / 200 * 100}%` }"
                class="flex justify-center rounded-t bg-green-500 text-xs text-white"
              >
                <span class="py-0.5 font-mono md:py-2">{{ week.count[1] }}</span>
              </div>
              <div
                v-if="week.count[0]"
                :style="{ height: `${(week.count[0] ?? 0) / 200 * 100}%` }"
                :class="{ 'rounded-t': (week.count[1] ?? 0) === 0 }"
                class="flex justify-center rounded-b bg-green-900 text-xs text-white"
              >
                <span class="py-0.5 font-mono md:py-2">{{ week.count[0] }}</span>
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
        <div class="mb-6 flex justify-end gap-2">
          <div class="rounded bg-blue-600 px-2 py-1 text-sm text-white">
            真名投稿 <code>571</code>
          </div>
          <div class="rounded bg-blue-400 px-2 py-1 text-sm text-white">
            化名投稿 <code>79</code>
          </div>
        </div>
        <ScrollArea class="h-[500px]" type="always">
          <div class="flex flex-col gap-2">
            <div v-for="singer of singerData" :key="singer.label" class="items-center gap-3 md:flex">
              <div class="truncate text-xs text-muted-foreground md:w-40 md:text-right">
                {{ singer.label }}
              </div>
              <div class="flex w-full">
                <div
                  v-if="singer.data[0]"
                  :style="{ width: `${(singer.data[0] ?? 0) / 32 * 100}%` }"
                  class="flex h-6 items-center rounded-l bg-blue-600 text-xs text-white"
                  :class="{ 'rounded-r': (singer.data[1] ?? 0) === 0 }"
                >
                  <span class="px-0.5 font-mono md:px-2">{{ singer.data[0] }}</span>
                </div>
                <div
                  v-if="singer.data[1]"
                  :style="{ width: `${(singer.data[1] ?? 0) / 32 * 100}%` }"
                  class="flex h-6 items-center rounded-r bg-blue-400 text-xs text-white"
                  :class="{ 'rounded-l': (singer.data[0] ?? 0) === 0 }"
                >
                  <span class="px-0.5 font-mono md:px-2">{{ singer.data[1] }}</span>
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
import singerData from '~~/public/singerRank.json';
import weekData from '~~/public/week.json';

function getRatio(a?: number, b?: number) {
  return (a ?? 0) / ((a ?? 0) + (b ?? 0)) * 100;
}
</script>
