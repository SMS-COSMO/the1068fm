<template>
  <div class="max-w-[600px] mx-auto">
    <div class="mx-8">
      <div class="mb-4 mt-8 flex justify-start">
        <NuxtImg preload src="/combined-logo.svg" class="w-[72vw]"></NuxtImg>
      </div>
      <section class="my-4 grid grid-cols-1 gap-4">
        <div class="grid grid-cols-2 gap-2">
          <UiCard class="shadow p-0 pt-1 pb-2">
            <UiCardHeader class="pt-1 pb-0 text-3xl font-bold">
              <AnimatedNumber :value="songListInfo?.allSongs" />
            </UiCardHeader>
            <UiCardContent class="pt-0 pb-0">
              <span class="text-md">已收集歌曲</span>
            </UiCardContent>
          </UiCard>
          <UiCard class="shadow p-0 pt-1 pb-2">
            <UiCardHeader class="pt-1 pb-0 text-3xl font-bold">
              <AnimatedNumber :value="songListInfo?.reviewedSongs" />
            </UiCardHeader>
            <UiCardContent class="pt-0 pb-0">
              <span class="text-md">已审核歌曲</span>
            </UiCardContent>
          </UiCard>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <SubmissionRulesDialog>
            <UiButton type="button" class="w-auto shadow text-md p-0" variant="outline">
              <span class="icon-[radix-icons--question-mark-circled] w-5 h-5 mr-1" />
              <span class="align-bottom">
                规则介绍
              </span>
            </UiButton>
          </SubmissionRulesDialog>
          <UiButton class="w-auto shadow text-md p-0">
            <NuxtLink class="w-auto text-md p-0 flex items-center"  to="/submit">
              <Music4 class="w-5 h-5 mr-1" />
              <span class="align-bottom">
                歌曲投稿
              </span>
            </NuxtLink>
          </UiButton>
          <AboutUsDialog>
            <UiButton type="button" class="w-auto shadow text-md p-0" variant="outline">
              <span class="icon-[radix-icons--info-circled] w-5 h-5 mr-1" />
              <span class="align-bottom">
                关于我们
              </span>
            </UiButton>
          </AboutUsDialog>
        </div>
      </section>

      <UiCard class="my-4 shadow">
        <UiCardContent class="p-4">
          <UiTabs v-model="selectedTab" class="overflow-x-hidden">
            <UiTabsList class="grid grid-cols-2">
              <UiTabsTrigger value="songList">
                歌单
              </UiTabsTrigger>
              <UiTabsTrigger value="arrangement">
                排歌表
              </UiTabsTrigger>
            </UiTabsList>
            <UiTabsContent value="songList" ref="dragLeft" v-drag="dragLeftHandler"
              :style="`transform: translate(${tabShift}px, 0); opacity: ${1 - tabShift / -150 - 0.2}`"
              class="duration-100">
              <UiInput v-model="searchContent" placeholder="搜索歌单" class="text-md mb-2" />
              <div v-for="(song, index) in processedListData" :key="index">
                <MusicCard :song="song" />
              </div>
            </UiTabsContent>
            <UiTabsContent value="arrangement" ref="dragRight" v-drag="dragRightHandler"
              :style="`transform: translate(${tabShift}px, 0); opacity: ${1 - tabShift / 150 - 0.2}`"
              class="duration-100">
              <DatePicker v-model="selectedDate" mode="date" view="weekly" expanded title-position="left" locale="zh"
                borderless :attributes="calendarAttr" class="mb-2" />
              <div v-for="song in arrangement" :key="song.id">
                <MusicCard :song="song" />
              </div>
              <p v-if="!arrangement" class="text-sm text-center">
                今日无排歌哦~
              </p>
            </UiTabsContent>
          </UiTabs>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
  <!-- dummy dom item to make sure that dragRight is never undefined -->
  <div ref="dragLeft"></div>
  <div ref="dragRight"></div>
</template>

<script setup lang="ts">
import { Music4 } from 'lucide-vue-next';
import type { TSafeSongList, TSongListInfo, TArrangementList } from '~/types';
import { useFuse } from '@vueuse/integrations/useFuse';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { getDateString } from '~/lib/utils';
import { useDrag } from '@vueuse/gesture';
const { $api } = useNuxtApp();

const songList = ref<TSafeSongList>([]);
const songListInfo = ref<TSongListInfo>();
const selectedTab = ref('songList');

const tabShift = ref(0);
const dragLeft = ref();
const dragRight = ref();
const dragLeftHandler = (state: any) => {
  if (state.axis === 'y')
    return;
  if (state.movement[0] < -30)
    tabShift.value = state.movement[0] * state.movement[0] / -150;
  if (state.dragging === false)
    tabShift.value = 0;
  if (state.movement[0] < -150) {
    selectedTab.value = 'arrangement';
    tabShift.value = 0;
  }
};
const dragRightHandler = (state: any) => {
  if (state.axis === 'y')
    return;
  if (state.movement[0] > 30)
    tabShift.value = state.movement[0] * state.movement[0] / 150;
  if (state.dragging === false)
    tabShift.value = 0;
  if (state.movement[0] > 150) {
    selectedTab.value = 'songList';
    tabShift.value = 0;
  }
};
useDrag(dragLeftHandler, { domTarget: dragLeft });
useDrag(dragRightHandler, { domTarget: dragRight });

definePageMeta({
  pageTransition: {
    name: 'slide-right',
    mode: 'out-in'
  }
});

useHead({
  title: 'the1068fm 点歌系统',
  meta: [
    { name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' }
  ],
  bodyAttrs: {
    class: 'm-0 min-w-screen'
  },
});

prerenderRoutes('/submit')

const searchContent = ref('');
const fuseOptions = {
  fuseOptions: {
    keys: ['name', 'creator'],
    shouldSort: true,
    threshold: 0.6,
    useExtendedSearch: true,
  },
  matchAllWhenSearchEmpty: true,
};
const fuse = useFuse(searchContent, songList, fuseOptions);

const processedListData = computed(() => fuse.results.value.map(s => s.item));

const selectedDate = ref(new Date());
const arrangementList = ref<TArrangementList>([]);
const arrangement = computed(
  () => arrangementList.value.find(e => e.date === getDateString(selectedDate.value))?.songs
);
const calendarAttr = computed(() => {
  const res = [];
  for (const arrangement of arrangementList.value) {
    res.push({
      dot: true,
      dates: new Date(arrangement.date),
    });
  }

  return res;
});

try {
  songList.value = (await $api.song.listSafe.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  arrangementList.value = await $api.arrangement.list.query();
} catch (err) {
  useErrorHandler(err)
}
try {
  songListInfo.value = await $api.song.info.query();
} catch (err) {
  useErrorHandler(err)
}
</script>

<style>
.calendar .vc-day:has(.vc-highlights) {
  background: transparent;
}

.vc-day-box-center-bottom {
  margin: 3px !important;
}

.vc-week {
  height: 48px !important;
}
</style>