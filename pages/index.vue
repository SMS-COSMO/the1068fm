<script setup lang="ts">
import { Music4 } from 'lucide-vue-next';
import { useFuse } from '@vueuse/integrations/useFuse';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useDrag } from '@vueuse/gesture';
import { useWindowFocus } from '@vueuse/core';
import { getDateString } from '~/lib/utils';

const { $api } = useNuxtApp();

const [isSubmitOpen, toggleSubmit] = useToggle(false);

const { data: rawSongList } = await $api.song.listSafe.useQuery();
const songList = ref(
  (rawSongList.value ?? []).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
);
const { data: arrangementList } = await $api.arrangement.listSafe.useQuery();

const songListInfo = ref(0);
const timeCanSubmit = ref(true);
try {
  songListInfo.value = await $api.song.info.query();
  timeCanSubmit.value = await $api.time.currently.query();
} catch (err) {
  useErrorHandler(err);
}

const isDesktop = ref(false);
onMounted(() => {
  // @ts-expect-error window
  isDesktop.value = window.innerWidth > 800 && window.innerHeight > 600;
});

const canSubmit = ref(false);
onMounted(() => {
  const userStore = useUserStore();
  canSubmit.value = userStore.canSubmit();
});

const selectedTab = ref('songList');

const tabShift = ref(0);
const dragLeft = ref();
const dragRight = ref();
function dragLeftHandler(state: any) {
  if (isDesktop.value)
    return;
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
}
function dragRightHandler(state: any) {
  if (isDesktop.value)
    return;
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
}
useDrag(dragLeftHandler, { domTarget: dragLeft });
useDrag(dragRightHandler, { domTarget: dragRight });

definePageMeta({
  pageTransition: {
    name: 'slide-right',
    mode: 'out-in',
  },
});

useHead({
  title: 'the1068fm 点歌系统',
  meta: [
    { name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' },
  ],
  bodyAttrs: {
    class: 'm-0 min-w-screen',
  },
});

await preloadComponents(['SubmitDialog', 'SubmissionRulesDialog', 'AboutUsDialog']);

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
const showLength = ref(100);

const selectedDate = ref(new Date());
const arrangement = computed(
  () => arrangementList.value?.find(e => e.date === getDateString(selectedDate.value))?.songs,
);
const calendarAttr = computed(() => {
  const res = [];
  for (const arrangement of arrangementList.value ?? []) {
    res.push({
      dot: true,
      dates: new Date(arrangement.date),
    });
  }

  return res;
});

onMounted(() => {
  useTimeoutPoll(useRefreshData, 5000, { immediate: true });
});
const focused = useWindowFocus();
async function useRefreshData() {
  // pause refresh data when submit dialog is open or page is out of focus
  if (isSubmitOpen.value || !focused.value)
    return;
  try {
    const res = await Promise.all([
      $api.song.info.query(),
      $api.time.currently.query(),
      $api.song.listSafe.query(),
    ]);

    songListInfo.value = res[0];
    timeCanSubmit.value = res[1];
    songList.value = res[2].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } catch {
    // swallow the errors
  }
}
</script>

<template>
  <div class="max-w-[600px] lg:max-w-[1200px] mx-auto">
    <div class="mx-5 grid lg:grid-cols-2 lg:gap-8">
      <div>
        <div class="mb-4 mt-8 flex justify-start">
          <NuxtImg preload src="/combined-logo.svg" class="w-[72vw]" />
        </div>
        <section class="my-4 grid grid-cols-1 gap-4 font-shuhei">
          <div class="grid grid-cols-2 gap-2">
            <UiCard class="shadow p-0 pt-1 pb-2">
              <UiCardHeader class="pt-1 pb-0 text-3xl font-bold">
                {{ songListInfo }}
              </UiCardHeader>
              <UiCardContent class="pt-0 pb-0">
                <span class="text-md">已收集歌曲</span>
              </UiCardContent>
            </UiCard>
            <TimeAvailableDialog>
              <TimeAvailability :status="timeCanSubmit ? 'can' : 'cannot'" is-card />
            </TimeAvailableDialog>
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
            <SubmitDialog :is-open="isSubmitOpen" :toggle-open="toggleSubmit" @submit-success="(song) => { songList.unshift(song); canSubmit = false; }">
              <UiButton type="button" class="w-auto shadow text-md p-0" :disabled="!timeCanSubmit || !canSubmit">
                <Music4 class="w-5 h-5 mr-1" />
                <span class="align-bottom">
                  歌曲投稿
                </span>
              </UiButton>
            </SubmitDialog>
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

        <UiCard class="lg:hidden my-4 shadow">
          <UiCardContent class="p-4">
            <UiTabs v-model="selectedTab" class="overflow-x-hidden">
              <UiTabsList class="grid grid-cols-2">
                <UiTabsTrigger value="songList" class="font-shuhei">
                  已收集投稿
                </UiTabsTrigger>
                <UiTabsTrigger value="arrangement" class="font-shuhei">
                  歌单
                </UiTabsTrigger>
              </UiTabsList>
              <UiTabsContent
                ref="dragLeft" v-drag="dragLeftHandler" value="songList"
                :style="`transform: translate(${tabShift}px, 0); opacity: ${1 - tabShift / -150 - 0.2}`"
                class="duration-100"
              >
                <UiInput v-model="searchContent" placeholder="搜索歌曲" class="text-md mb-2" />
                <TransitionGroup name="list" tag="ul">
                  <li v-for="song in processedListData.slice(0, showLength)" :key="song.id">
                    <MusicCard :song="song" show-mine />
                  </li>
                </TransitionGroup>
                <UiAlert v-if="showLength < processedListData.length">
                  <UiAlertDescription class="flex flex-row">
                    <span class="self-center">
                      出于性能考虑，仅加载前 {{ showLength }} 首歌
                    </span>
                    <UiButton variant="secondary" class="ml-auto w-[100px]" @click="showLength += 50">
                      加载更多
                    </UiButton>
                  </UiAlertDescription>
                </UiAlert>
              </UiTabsContent>
              <UiTabsContent
                ref="dragRight" v-drag="dragRightHandler" value="arrangement"
                :style="`transform: translate(${tabShift}px, 0); opacity: ${1 - tabShift / 150 - 0.2}`"
                class="duration-100"
              >
                <DatePicker
                  v-model="selectedDate" mode="date" view="weekly" expanded title-position="left" locale="zh"
                  borderless :attributes="calendarAttr" class="mb-2" is-required
                />
                <TransitionGroup name="list" tag="ul">
                  <li v-for="song in arrangement" :key="song.id">
                    <MusicCard :song="song" show-mine />
                  </li>
                </TransitionGroup>
                <p v-if="!arrangement" class="text-sm text-center">
                  今日无排歌哦~
                </p>
              </UiTabsContent>
            </UiTabs>
          </UiCardContent>
        </UiCard>
        <UiCard class="hidden lg:block">
          <UiCardHeader class="pb-4">
            <UiCardTitle class="mb-2">
              已收集投稿
            </UiCardTitle>
            <UiInput v-model="searchContent" placeholder="搜索歌曲" class="text-md" />
          </UiCardHeader>
          <UiCardContent>
            <UiScrollArea class="h-[calc(100svh-29rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in processedListData.slice(0, showLength)" :key="song.id">
                  <MusicCard :song="song" show-mine />
                </li>
              </TransitionGroup>
              <UiAlert v-if="showLength < processedListData.length">
                <UiAlertDescription class="flex flex-row">
                  <span class="self-center">
                    出于性能考虑，仅加载前 {{ showLength }} 首歌
                  </span>
                  <UiButton variant="secondary" class="ml-auto w-[100px]" @click="showLength += 50">
                    加载更多
                  </UiButton>
                </UiAlertDescription>
              </UiAlert>
            </UiScrollArea>
          </UiCardContent>
        </UiCard>
      </div>
      <UiCard class="hidden lg:block mt-10">
        <UiCardHeader>
          <UiCardTitle>
            歌单
          </UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <DatePicker
            v-model="selectedDate" mode="date" view="weekly" expanded title-position="left" locale="zh"
            borderless :attributes="calendarAttr" class="mb-2" is-required
          />
          <UiScrollArea class="h-[calc(100svh-19rem)]">
            <TransitionGroup name="list" tag="ul">
              <li v-for="song in arrangement" :key="song.id">
                <MusicCard :song="song" show-mine />
              </li>
            </TransitionGroup>
            <p v-if="!arrangement" class="text-sm text-center">
              今日无排歌哦~
            </p>
          </UiScrollArea>
        </UiCardContent>
      </UiCard>
    </div>
    <!-- dummy dom item to make sure that dragRight is never undefined -->
    <div ref="dragLeft" />
    <div ref="dragRight" />
  </div>
</template>

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
