<script setup lang="ts">
import {
  ArrowLeft,
  Check,
  Trash2,
  X,
} from 'lucide-vue-next';
import type { TSong, TSongList, TStatus } from '~/types';

const { $api } = useNuxtApp();

definePageMeta({
  pageTransition: {
    name: 'slide-down',
    mode: 'out-in',
  },
});

useHead({
  title: '审核歌曲 | the1068fm 点歌系统',
  meta: [
    { name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' },
  ],
});

const songList = ref<TSongList>([]);
const unsetList = computed(
  () => songList.value.filter(s => (s.status === 'unset'))
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)), // Oldest first
);
const approvedList = computed(
  () => songList.value.filter(s => (s.status === 'approved'))
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)), // Oldest first
);
const rejectedList = computed(
  () => songList.value.filter(s => (s.status === 'rejected'))
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)), // Newest first
);
const isDesktop = ref(true);

const showLength = reactive({
  unset: 100,
  approved: 100,
  rejected: 100,
});

const selectedSong = ref<TSong>();
const searchLoading = ref(false);
const searchListCache = ref<Map<string, any>>(new Map());
const searchList = ref();
async function setSearchList() {
  searchLoading.value = true;
  searchList.value = await getSearchList(selectedSong.value);
  searchLoading.value = false;
}
async function getSearchList(song?: TSong) {
  // Use cache
  const name = `${song?.name ?? ''} ${song?.creator ?? ''}`;
  const mapVal = searchListCache.value.get(name);
  if (mapVal)
    return mapVal;

  const formData = new FormData();
  formData.append('input', name);
  formData.append('filter', 'name');
  formData.append('type', 'netease');

  const res: any = (await useFetch('/liuzhijin', {
    method: 'post',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    mode: 'cors',
  })).data;

  // Store cache
  const data = JSON.parse(res.value).data;
  searchListCache.value.set(name, data);
  return data;
};

async function rejectAll() {
  await batchUpdateSong(unsetList.value, 'rejected');
}

async function approveAll() {
  await batchUpdateSong(unsetList.value, 'approved');
}

async function updateSong(song: TSong, status: TStatus) {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    const i = songList.value.findIndex(item => item.id === song.id);
    songList.value[i].status = status;
  } catch (err) {
    useErrorHandler(err);
  }
}

async function remove(song: TSong) {
  try {
    await $api.song.remove.mutate({ id: song.id });
    const i = songList.value.findIndex(item => item.id === song.id);
    songList.value.splice(i, 1);
  } catch (err) {
    useErrorHandler(err);
  }
}

async function batchUpdateSong(songs: TSong[], status: TStatus) {
  try {
    await $api.song.batchModifyStatus.mutate({ ids: songs.map(item => item.id), status });
    for (const song of songs) {
      const i = songList.value.findIndex(item => item.id === song.id);
      if (i === -1) {
        song.status = status;
        songList.value.push(song);
      } else {
        songList.value[i].status = status;
      }
    }
  } catch (err) {
    useErrorHandler(err);
  }
}

async function reviewSong(song: TSong, status: TStatus) {
  await updateSong(song, status);
  selectedSong.value = unsetList.value[unsetList.value.indexOf(song) + 1];
}

const listLoading = ref(false);
onMounted(async () => {
  try {
  // @ts-expect-error window
    isDesktop.value = window.innerWidth > 800 && window.innerHeight > 600;
    await $api.user.tokenValidity.query();
  } catch (err) {
    navigateTo('/manage/login');
  }

  try {
    listLoading.value = true;
    songList.value = await $api.song.listUnused.query();
    listLoading.value = false;
  } catch (err) {
    useErrorHandler(err);
  }

  // prefetch songList cache
  for (const song of unsetList.value.slice(0, 100))
    await getSearchList(song);
});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-3 lg:gap-5 lg:h-screen p-4 lg:p-5">
    <UiCard class="basis-1/4 pt-4 relative">
      <UiCardHeader class="px-4 pt-3 lg:px-6 lg:pt-6">
        <UiCardTitle class="flex flex-row">
          <span class="icon-[tabler--help-square] mr-2" />
          待审核
          <UiBadge variant="secondary" class="ml-2 self-center">
            {{ unsetList.length }}
          </UiBadge>
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6 overflow-hidden">
        <ContentLoading v-if="listLoading" class="lg:h-[calc(100vh-13rem)]" />
        <UiScrollArea v-else class="lg:h-[calc(100vh-13rem)]">
          <TransitionGroup name="list" tag="ul" class="flex flex-row w-max gap-2 lg:block lg:w-full">
            <li v-for="song in unsetList.slice(0, showLength.unset)" :key="song.id">
              <UiContextMenu>
                <UiContextMenuTrigger>
                  <MusicCard
                    :compact="!isDesktop" :song="song" :selected="selectedSong === song" class="cursor-pointer w-[calc(100vw-6rem)] lg:w-full h-full"
                    @click="selectedSong = song; setSearchList()"
                  />
                </UiContextMenuTrigger>
                <UiContextMenuContent>
                  <UiContextMenuItem @click="updateSong(song, 'approved')">
                    <Check class="mr-1 h-4 w-4" />
                    通过
                  </UiContextMenuItem>
                  <UiContextMenuItem @click="updateSong(song, 'rejected')">
                    <X class="mr-1 h-4 w-4" />
                    拒绝
                  </UiContextMenuItem>
                  <UiContextMenuItem @click="remove(song)">
                    <Trash2 class="mr-1 h-4 w-4" />
                    彻底删除
                  </UiContextMenuItem>
                </UiContextMenuContent>
              </UiContextMenu>
            </li>
          </TransitionGroup>
          <UiAlert v-if="showLength.unset < unsetList.length">
            <UiAlertDescription class="flex flex-row">
              <span class="self-center">
                出于性能考虑，仅加载前 {{ showLength.unset }} 首歌
              </span>
              <UiButton variant="secondary" class="float-right ml-auto" @click="showLength.unset += 50">
                加载更多
              </UiButton>
            </UiAlertDescription>
          </UiAlert>
          <UiScrollBar v-if="!isDesktop" orientation="horizontal" />
        </UiScrollArea>
        <div class="float-right mt-2 lg:mt-4 flex flex-row gap-2">
          <OperationAllPopover :action="() => { approveAll() }" name="通过" />
          <OperationAllPopover :action="() => { rejectAll() }" name="拒绝" is-destructive />
        </div>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-1/2 pt-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row px-4 pt-3 lg:px-6 lg:pt-6">
        <UiCardTitle class="flex flex-row">
          <span class="icon-[tabler--headphones] mr-2" />
          歌曲试听
        </UiCardTitle>
        <div v-if="selectedSong" class="ml-auto h-4">
          <UiButton
            variant="secondary" size="icon"
            class="w-10 lg:w-20 my-[-10px] hover:bg-green-200 hover:border-green-400 hover:text-green-700"
            @click="reviewSong(selectedSong, 'approved');"
          >
            <Check class="w-5 h-5" />
          </UiButton>
          <UiButton
            variant="secondary" size="icon"
            class="w-10 lg:w-20 ml-2 lg:ml-3 my-[-10px] hover:bg-red-200 hover:border-red-400 hover:text-red-700"
            @click="reviewSong(selectedSong, 'rejected');"
          >
            <X class="w-5 h-5" />
          </UiButton>
        </div>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6">
        <UiScrollArea class="lg:h-[calc(100vh-10rem)]">
          <template v-if="!searchLoading">
            <div v-for="song in searchList" :key="song">
              <MusicPlayerCard :song="song" :compact="!isDesktop" />
            </div>
          </template>
          <template v-if="searchLoading && selectedSong">
            <UiCard v-for="n in 10" :key="n" class="flex items-center space-x-4 mb-2">
              <UiCardHeader class="items-start gap-4 space-y-0 flex-row w-full">
                <UiSkeleton class="h-20 w-20 rounded-sm" />
                <div class="space-y-2 w-full">
                  <UiSkeleton class="h-5 w-3/5" />
                  <UiSkeleton class="h-5 w-1/5" />
                  <UiSkeleton class="h-5 w-full" />
                </div>
              </UiCardHeader>
            </UiCard>
          </template>
        </UiScrollArea>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-1/4 pt-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row px-4 pt-3 lg:px-6 lg:pt-6">
        <div class="space-y-1">
          <UiCardTitle class="flex flex-row">
            <span class="icon-[tabler--square-check] mr-2" />
            已审核
          </UiCardTitle>
        </div>
        <UiButton variant="secondary" class="self-center my-[-10px] ml-auto" @click="navigateTo('/manage')">
          返回排歌模式
        </UiButton>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6">
        <UiTabs default-value="approved">
          <UiTabsList class="grid grid-cols-2">
            <UiTabsTrigger value="approved">
              已通过
              <UiBadge variant="secondary" class="ml-2">
                {{ approvedList.length }}
              </UiBadge>
            </UiTabsTrigger>
            <UiTabsTrigger value="rejected">
              已拒绝
              <UiBadge variant="secondary" class="ml-2">
                {{ rejectedList.length }}
              </UiBadge>
            </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="approved">
            <ContentLoading v-if="listLoading" />
            <UiScrollArea v-else class="h-[calc(100vh-14rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in approvedList.slice(0, showLength.approved)" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" :compact="!isDesktop" />
                    </UiContextMenuTrigger>
                    <UiContextMenuContent>
                      <UiContextMenuItem @click="updateSong(song, 'rejected')">
                        <X class="mr-1 h-4 w-4" />
                        拒绝
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="updateSong(song, 'unset')">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        移入待审核
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="remove(song)">
                        <Trash2 class="mr-1 h-4 w-4" />
                        彻底删除
                      </UiContextMenuItem>
                    </UiContextMenuContent>
                  </UiContextMenu>
                </li>
              </TransitionGroup>
              <UiAlert v-if="showLength.approved < approvedList.length">
                <UiAlertDescription class="flex flex-row">
                  <span class="self-center">
                    出于性能考虑，仅加载前 {{ showLength.approved }} 首歌
                  </span>
                  <UiButton variant="secondary" class="float-right ml-auto" @click="showLength.approved += 50">
                    加载更多
                  </UiButton>
                </UiAlertDescription>
              </UiAlert>
            </UiScrollArea>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            <ContentLoading v-if="listLoading" />
            <UiScrollArea v-else class="h-[calc(100vh-14rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in rejectedList.slice(0, showLength.rejected)" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" :compact="!isDesktop" />
                    </UiContextMenuTrigger>
                    <UiContextMenuContent>
                      <UiContextMenuItem @click="updateSong(song, 'approved')">
                        <Check class="mr-1 h-4 w-4" />
                        通过
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="updateSong(song, 'unset')">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        移入待审核
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="remove(song)">
                        <Trash2 class="mr-1 h-4 w-4" />
                        彻底删除
                      </UiContextMenuItem>
                    </UiContextMenuContent>
                  </UiContextMenu>
                </li>
              </TransitionGroup>
              <UiAlert v-if="showLength.rejected < rejectedList.length">
                <UiAlertDescription class="flex flex-row">
                  <span class="self-center">
                    出于性能考虑，仅加载前 {{ showLength.rejected }} 首歌
                  </span>
                  <UiButton variant="secondary" class="float-right ml-auto" @click="showLength.rejected += 50">
                    加载更多
                  </UiButton>
                </UiAlertDescription>
              </UiAlert>
            </UiScrollArea>
          </UiTabsContent>
        </UiTabs>
      </UiCardContent>
    </UiCard>
  </div>
</template>
