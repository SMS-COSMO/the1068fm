<script setup lang="ts">
import { Music4 } from 'lucide-vue-next';
import { useFuse } from '@vueuse/integrations/useFuse';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useDrag } from '@vueuse/gesture';
import { getDateString } from '~/lib/utils';
import type { TSafeArrangementList, TSafeSongList } from '~/types';

const { $api } = useNuxtApp();

const isDesktop = ref(false);
const [isSubmitOpen, toggleSubmit] = useToggle(false);

const songList = ref<TSafeSongList>([]);
const songListInfo = ref(0);
const selectedTab = ref('songList');
const isSongListLoading = ref(true);
const isArrangementLoading = ref(true);
const timeCanSubmit = ref(true);
const canSubmit = ref(false);

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
const arrangementList = ref<TSafeArrangementList>([]);
const arrangement = computed(
  () => arrangementList.value.find(e => e.date === getDateString(selectedDate.value))?.songs,
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

async function useRefreshData() {
  if (isSubmitOpen.value)
    return; // pause refresh data when submit dialog is open
  try {
    const newSongInfoData = await $api.song.info.query();
    songListInfo.value = newSongInfoData;
    const newCanSubmit = await $api.time.currently.query();
    timeCanSubmit.value = newCanSubmit;
    const newSongListData = (await $api.song.listSafe.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    songList.value = newSongListData;
    const newArrangementData = await $api.arrangement.listSafe.query();
    arrangementList.value = newArrangementData;
  } catch (err) {
    // swallow the errors
  }
}

try {
  songListInfo.value = await $api.song.info.query();
  timeCanSubmit.value = await $api.time.currently.query();
} catch (err) {
  useErrorHandler(err);
}

onMounted(async () => {
  const userStore = useUserStore();
  canSubmit.value = userStore.canSubmit();

  try {
    isDesktop.value = window.innerWidth > 800 && window.innerHeight > 600;
    songList.value = (await $api.song.listSafe.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    isSongListLoading.value = false;
    arrangementList.value = await $api.arrangement.listSafe.query();
    isArrangementLoading.value = false;
  } catch (err) {
    useErrorHandler(err);
  }
  useTimeoutPoll(useRefreshData, 5000, { immediate: true });
});
</script>

<template>
  <div :class="`${isDesktop ? 'max-w-[1200px]' : 'max-w-[600px]'} mx-auto`">
    <div :class="`mx-5 ${isDesktop ? 'grid grid-cols-2 gap-8' : ''}`">
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
              <TimeAvailability is-card />
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

        <UiCard v-if="!isDesktop" class="my-4 shadow">
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
                <template v-if="!isSongListLoading">
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
                </template>
                <ContentLoading v-else />
              </UiTabsContent>
              <UiTabsContent
                ref="dragRight" v-drag="dragRightHandler" value="arrangement"
                :style="`transform: translate(${tabShift}px, 0); opacity: ${1 - tabShift / 150 - 0.2}`"
                class="duration-100"
              >
                <template v-if="!isArrangementLoading">
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
                </template>
                <ContentLoading v-else />
              </UiTabsContent>
            </UiTabs>
          </UiCardContent>
        </UiCard>
        <UiCard v-else>
          <UiCardHeader class="pb-4">
            <UiCardTitle class="mb-2">
              已收集投稿
            </UiCardTitle>
            <UiInput v-model="searchContent" placeholder="搜索歌曲" class="text-md" />
          </UiCardHeader>
          <UiCardContent>
            <UiScrollArea class="h-[calc(100svh-29rem)]">
              <template v-if="!isSongListLoading">
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
              </template>
              <ContentLoading v-else />
            </UiScrollArea>
          </UiCardContent>
        </UiCard>
      </div>
      <UiCard v-if="isDesktop" class="mt-10">
        <UiCardHeader>
          <UiCardTitle>
            歌单
          </UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <template v-if="!isArrangementLoading">
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
          </template>
          <ContentLoading v-else />
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
