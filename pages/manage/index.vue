<script setup lang="ts">
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import dayjs from 'dayjs';
import { VueDraggable } from 'vue-draggable-plus';
import { getDateString } from '~/lib/utils';
import type { TArrangementList, TSong, TSongList, TStatus } from '~/types';

const { $api, $toast } = useNuxtApp();

definePageMeta({
  pageTransition: {
    name: 'slide-up',
    mode: 'out-in',
  },
});

useHead({
  title: '后台 | the1068fm 点歌系统',
  meta: [
    { name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' },
  ],
});

const userStore = useUserStore();
const isDesktop = ref(true);
const accountOpen = ref(false);
const arrangementList = ref<TArrangementList>([]);

type TArrange = 'day' | 'week';
const autoArrangeScopeText = {
  day: '一天',
  week: '一周',
};
const autoArrangeScopeLength = ref<TArrange>(userStore.autoArrange);
function setAutoArrangeScopeLength(newVal: TArrange) {
  autoArrangeScopeLength.value = newVal;
  userStore.changeAutoArrange(newVal);
}

const showActions = ref(false);

const showArrangeScope = ref(false);
const arrangeScope = computed(() => {
  let maxDate = dayjs();
  for (const arrangement of arrangementList.value) {
    const d = dayjs(arrangement.date);
    maxDate = maxDate > d ? maxDate : d;
  }

  let startDate = maxDate;
  if (autoArrangeScopeLength.value === 'week')
    startDate = maxDate.add(maxDate.day() === 0 ? 0 : 1, 'w').startOf('w').add(1, 'd');
  else
    startDate = maxDate.add(1, 'd');
  const endDate = autoArrangeScopeLength.value === 'week' ? startDate.endOf('w').subtract(1, 'd') : startDate;

  return {
    start: startDate,
    end: endDate,
  };
});

const arrangeLoading = ref(false);

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

const showLength = reactive({
  unset: 100,
  approved: 100,
  rejected: 100,
});

const date = ref(new Date());
const dateString = computed(() => getDateString(date.value));
const arrangement = computed(
  () => arrangementList.value.find(e => e.date === dateString.value),
);

async function updateArrangement() {
  try {
    await $api.arrangement.modifySongList.mutate({
      date: dateString.value,
      newSongList: arrangement.value?.songs.map(item => item.id) ?? [],
    });
    return true;
  } catch (err) {
    useErrorHandler(err);
    return false;
  }
}

const drag = ref(false);
function onStart() {
  drag.value = true;
}

function onEnd() {
  nextTick(() => {
    drag.value = false;
  });
}

const calendarAttr = computed(() => {
  const res = [];
  for (const arrangement of arrangementList.value) {
    let dotColor = 'orange';
    if (arrangement.songs.length === 0)
      dotColor = 'gray';
    else if (arrangement.songs.length < 10)
      dotColor = 'orange';
    else
      dotColor = 'green';

    res.push({
      dot: {
        style: {
          backgroundColor: dotColor,
        },
      },
      dates: new Date(arrangement.date),
    });
  }

  if (showArrangeScope.value) {
    res.push({
      highlight: {
        start: { fillMode: 'outline', color: 'blue' },
        base: { fillMode: 'light', color: 'blue' },
        end: { fillMode: 'outline', color: 'blue' },
      },
      dates: {
        start: arrangeScope.value.start.toDate(),
        end: arrangeScope.value.end.toDate(),
      },
    });
  }
  return res;
});

async function arrange() {
  arrangeLoading.value = true;
  const { start, end } = arrangeScope.value;
  const neededSongCount = (end.diff(start, 'd') + 1) * 10;
  if (neededSongCount > approvedList.value.length) {
    $toast.error(`审核通过的歌曲不足，至少需要${neededSongCount}首歌，还差${neededSongCount - approvedList.value.length}首`);
    arrangeLoading.value = false;
    return;
  }

  let i = start;
  while (i <= end) {
    const songs = approvedList.value.splice(0, 10);
    await $api.arrangement.create.mutate({ date: getDateString(i.toDate()), songIds: songs.map(item => item.id) });
    arrangementList.value.push({
      date: getDateString(i.toDate()),
      isPublic: false,
      songs,
    });
    await batchUpdateSong(songs, 'used');
    i = i.add(1, 'd');
  }
  arrangeLoading.value = false;
  $toast.success('排歌成功');
}

async function changeVisibility(date: string | undefined, isPublic: boolean) {
  if (!date || !arrangement.value)
    return;

  try {
    await $api.arrangement.modifyVisibility.mutate({ date, isPublic });
    arrangement.value.isPublic = isPublic;
  } catch (err) {
    useErrorHandler(err);
  }
}

async function updateSong(song: TSong, status: TStatus) {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    const i = songList.value.findIndex(item => item.id === song.id);
    if (i === -1) {
      song.status = status;
      songList.value.push(song);
    } else {
      songList.value[i].status = status;
    }
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

async function addToArrangement(song: TSong) {
  if (!arrangement.value || arrangement.value.songs.includes(song))
    return;

  arrangement.value.songs.push(song);
  const res = await updateArrangement();
  if (!res)
    arrangement.value.songs.pop();
  else
    await updateSong(song, 'used');
}

async function removeFromArrangement(song: TSong) {
  if (!arrangement.value)
    return;

  const j = arrangement.value.songs.indexOf(song);
  if (j === -1)
    return;
  arrangement.value.songs.splice(j, 1);

  const res = await updateArrangement();
  if (!res)
    arrangement.value.songs.splice(j, 1, song);
  else
    await updateSong(song, 'approved');
}

const removeArrangementLoading = ref(false);
async function removeArrangement() {
  try {
    removeArrangementLoading.value = true;
    await $api.arrangement.remove.mutate({ date: dateString.value });
    const i = arrangementList.value.findIndex(item => item.date === dateString.value);
    arrangementList.value.splice(i, 1);
    removeArrangementLoading.value = false;
  } catch (err) {
    useErrorHandler(err);
  }
}

async function move(song: TSong, upset: 1 | -1) {
  if (!arrangement.value)
    return;

  const j = arrangement.value.songs.indexOf(song);
  const swap = (array: TSong[], i: number, j: number) => {
    array[i] = array.splice(j, 1, array[i])[0];
  };

  if (j + upset >= 0 && j + upset < arrangement.value.songs.length)
    swap(arrangement.value.songs, j, j + upset);
  const res = await updateArrangement();
  if (!res)
    swap(arrangement.value.songs, j, j + upset);
}

async function createEmptyArrangement() {
  try {
    await $api.arrangement.create.mutate({ date: dateString.value, songIds: [] });
    arrangementList.value.push({
      date: dateString.value,
      isPublic: false,
      songs: [],
    });
  } catch (err) {
    useErrorHandler(err);
  }
}

async function rejectAll() {
  await batchUpdateSong(unsetList.value, 'rejected');
}

async function approveAll() {
  await batchUpdateSong(unsetList.value, 'approved');
}

function logout() {
  userStore.logout();
  navigateTo('/manage/login');
}

const listLoading = ref(true);
const arrangementLoading = ref(true);

const { copy: useCopy } = useClipboard({ legacy: true });
const [songInfoOpen, toggleSongInfoOpen] = useToggle(false);
const songInfo = ref('');

function copySongInfo() {
  let info = '';
  if (!arrangement.value) {
    $toast.error('排歌表为空');
    return;
  }
  for (const song of arrangement.value.songs)
    info += `《${song.name}》 ${song.creator}\n`;
  songInfo.value = info.trim();
  useCopy(songInfo.value).then(
    () => $toast.success('复制成功'),
  ).catch((e) => {
    if (e.message)
      $toast.error(e.message);
    else
      $toast.error(e.toString());
    toggleSongInfoOpen();
  });
}

onMounted(async () => {
  // @ts-expect-error window
  isDesktop.value = window.innerWidth > 800 && window.innerHeight > 600;
  try {
    try {
      await $api.user.tokenValidity.query();
    } catch (err) {
      navigateTo('/manage/login');
    }

    songList.value = await $api.song.listUnused.query();
    listLoading.value = false;
    arrangementList.value = await $api.arrangement.list.query();
    arrangementLoading.value = false;
  } catch (err) {
    useErrorHandler(err);
  }
});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-3 lg:gap-5 lg:h-screen p-4 lg:p-5">
    <SongInfoDialog :is-open="songInfoOpen" :toggle-open="toggleSongInfoOpen" :info="songInfo" />
    <UiCard v-if="!isDesktop">
      <UiCardHeader class="flex flex-row p-0 pl-4 space-y-0">
        <UiButton variant="outline" size="icon" class="self-center" @click="showActions = !showActions">
          <ChevronDown v-if="!showActions" class="w-4 h-4" />
          <ChevronUp v-else class="w-4 h-4" />
        </UiButton>
        <TimeAvailability borderless class="w-full" @click="navigateTo('/manage/time')" />
      </UiCardHeader>
      <UiCardContent v-if="showActions" class="px-4 pb-4">
        <UiButton variant="outline" class="mt-2 w-full" :disabled="!arrangement" @click="copySongInfo">
          复制歌单内容
        </UiButton>
        <div class="flex flex-row items-center space-x-1 rounded-md text-secondary-foreground mt-2">
          <UiButton :disabled="arrangeLoading" variant="outline" class="basis-1/2 px-3 shadow-none" @click="arrange">
            <Loader2 v-if="arrangeLoading" class="w-4 h-4 mr-2 animate-spin" />
            一键排歌
          </UiButton>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton variant="outline" class="basis-1/3 px-2 shadow-none">
                <span class="w-16">
                  {{ autoArrangeScopeText[autoArrangeScopeLength] }}
                </span>
                <ChevronDown class="h-4 w-4 ml-1 text-secondary-foreground" />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent align="end" :align-offset="-5" class="w-[200px]">
              <UiDropdownMenuLabel>排歌时长</UiDropdownMenuLabel>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuCheckboxItem
                :checked="autoArrangeScopeLength === 'day'"
                @click="setAutoArrangeScopeLength('day')"
              >
                一天
              </UiDropdownMenuCheckboxItem>
              <UiDropdownMenuCheckboxItem
                :checked="autoArrangeScopeLength === 'week'"
                @click="setAutoArrangeScopeLength('week')"
              >
                一周
              </UiDropdownMenuCheckboxItem>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
          <UiToggle v-model:pressed="showArrangeScope" class="basis-1/6 shadow-none" variant="outline">
            预览
          </UiToggle>
        </div>
        <UiPopover v-model:open="accountOpen">
          <UiPopoverTrigger as-child>
            <UiButton
              variant="outline" role="combobox" :aria-expanded="accountOpen"
              class="justify-between w-full mt-2"
            >
              {{ userStore.userId }}
              <span class="icon-[radix-icons--caret-sort] text-lg" />
            </UiButton>
          </UiPopoverTrigger>
          <UiPopoverContent class="w-[200px] p-0">
            <UiCommand>
              <UiCommandGroup>
                <RegisterDialog>
                  <UiCommandItem value="register">
                    <span class="icon-[tabler--plus] mr-1" />
                    创建新账号
                  </UiCommandItem>
                </RegisterDialog>
                <ModifyPasswordDialog>
                  <UiCommandItem value="modifyPassword">
                    <span class="icon-[tabler--lock] mr-1" />
                    修改密码
                  </UiCommandItem>
                </ModifyPasswordDialog>
                <UiCommandItem value="logout" @select="logout">
                  <span class="icon-[tabler--logout] mr-1" />
                  登出
                </UiCommandItem>
              </UiCommandGroup>
            </UiCommand>
          </UiPopoverContent>
        </UiPopover>
      </UiCardContent>
    </UiCard>
    <client-only v-if="!isDesktop">
      <DatePicker
        v-model="date" mode="date" color="gray" locale="zh" view="weekly" :attributes="calendarAttr"
        :masks="{ title: 'YYYY MMM' }" class="rounded-lg border shadow-sm pb-3" expanded trim-weeks borderless is-required
      />
      <template #fallback>
        <UiAspectRatio :ratio="1 / 1">
          aa
        </UiAspectRatio>
      </template>
    </client-only>
    <UiCard v-if="isDesktop" class="lg:w-[600px] w-full relative hidden lg:block">
      <UiCardHeader>
        <UiCardTitle class="my-[-0.5rem]">
          <NuxtImg src="/logo.svg" class="h-14 mx-auto" />
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <client-only>
          <DatePicker
            v-model="date" mode="date" color="gray" locale="zh" :attributes="calendarAttr"
            :masks="{ title: 'YYYY MMM' }" class="rounded-lg border pb-3" expanded trim-weeks borderless is-required
          />
          <template #fallback>
            <UiAspectRatio :ratio="1 / 0.95">
              <Loader2 class="w-8 h-8 mx-auto mt-[150px] animate-spin" />
            </UiAspectRatio>
          </template>
        </client-only>
        <div class="flex flex-row items-center space-x-1 rounded-md text-secondary-foreground mt-4">
          <UiButton :disabled="arrangeLoading" variant="outline" class="basis-1/2 px-3 shadow-none" @click="arrange">
            <Loader2 v-if="arrangeLoading" class="w-4 h-4 mr-2 animate-spin" />
            一键排歌
          </UiButton>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton variant="outline" class="basis-1/3 px-2 shadow-none">
                <span class="w-16">
                  {{ autoArrangeScopeText[autoArrangeScopeLength] }}
                </span>
                <ChevronDown class="h-4 w-4 ml-1 text-secondary-foreground" />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent align="end" :align-offset="-5" class="w-[200px]">
              <UiDropdownMenuLabel>排歌时长</UiDropdownMenuLabel>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuCheckboxItem
                :checked="autoArrangeScopeLength === 'day'"
                @click="setAutoArrangeScopeLength('day')"
              >
                一天
              </UiDropdownMenuCheckboxItem>
              <UiDropdownMenuCheckboxItem
                :checked="autoArrangeScopeLength === 'week'"
                @click="setAutoArrangeScopeLength('week')"
              >
                一周
              </UiDropdownMenuCheckboxItem>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
          <UiToggle v-model:pressed="showArrangeScope" class="basis-1/6 shadow-none" variant="outline">
            预览
          </UiToggle>
        </div>
        <UiButton variant="outline" class="mt-4 w-full" :disabled="!arrangement" @click="copySongInfo">
          复制歌单内容
        </UiButton>
        <TimeAvailability show-button class="mt-4" />
        <UiPopover v-model:open="accountOpen">
          <UiPopoverTrigger as-child>
            <UiButton
              variant="outline" role="combobox" :aria-expanded="accountOpen"
              class="justify-between absolute bottom-5 left-5 w-[200px]"
            >
              {{ userStore.userId }}
              <span class="icon-[radix-icons--caret-sort] text-lg" />
            </UiButton>
          </UiPopoverTrigger>
          <UiPopoverContent class="w-[200px] p-0">
            <UiCommand>
              <UiCommandGroup>
                <RegisterDialog>
                  <UiCommandItem value="register">
                    <span class="icon-[tabler--plus] mr-1" />
                    创建新账号
                  </UiCommandItem>
                </RegisterDialog>
                <ModifyPasswordDialog>
                  <UiCommandItem value="modifyPassword">
                    <span class="icon-[tabler--lock] mr-1" />
                    修改密码
                  </UiCommandItem>
                </ModifyPasswordDialog>
                <UiCommandItem value="logout" @select="logout">
                  <span class="icon-[tabler--logout] mr-1" />
                  登出
                </UiCommandItem>
              </UiCommandGroup>
            </UiCommand>
          </UiPopoverContent>
        </UiPopover>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-1/2 relative pt-4">
      <UiCardHeader class="flex flex-row align-top space-y-0 px-4 pt-3 lg:px-6 lg:pt-6">
        <UiCardTitle class="flex flex-row">
          <span class="icon-[tabler--list-details] mr-2" />
          {{ `${date.getMonth() + 1}-${date.getDate()}` }} 排歌表
        </UiCardTitle>
        <div class="ml-auto flex items-center space-x-2">
          <label for="public" class="text-slate-600">是否公开</label>
          <UiSwitch
            id="public" :disabled="!arrangement" :checked="arrangement?.isPublic"
            @update:checked="changeVisibility(arrangement?.date, !arrangement?.isPublic)"
          />
        </div>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6">
        <ContentLoading v-if="arrangementLoading" />
        <UiTooltipProvider v-else-if="arrangement === undefined">
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiButton variant="outline" class="w-full h-24" @click="createEmptyArrangement">
                <Plus class="w-5 h-5" />
              </UiButton>
            </UiTooltipTrigger>
            <UiTooltipContent>
              <p>创建空白排歌表</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
        <div v-else>
          <UiScrollArea class="lg:h-[calc(100vh-12rem)]">
            <VueDraggable
              v-model="arrangement.songs"
              :delay="isDesktop ? 0 : 150" target=".sort-target" :animation="400"
              @update="updateArrangement" @start="onStart" @end="onEnd"
            >
              <TransitionGroup
                :name="drag ? '' : 'list'"
                tag="ul" class="sort-target" type="transition"
              >
                <li v-for="song in arrangement.songs" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" sorting show-grade :compact="!isDesktop">
                        <template #prefix>
                          <UiButton variant="outline" size="icon" class="h-7 w-8" @click="move(song, -1)">
                            <ChevronUp class="w-3.5 h-3.5" />
                          </UiButton>
                          <UiButton variant="outline" size="icon" class="h-7 w-8" @click="move(song, 1)">
                            <ChevronDown class="w-3.5 h-3.5" />
                          </UiButton>
                        </template>
                        <template #suffix>
                          <UiTooltipProvider>
                            <UiTooltip>
                              <UiTooltipTrigger as-child>
                                <UiButton
                                  class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700"
                                  variant="outline" size="icon" @click="removeFromArrangement(song)"
                                >
                                  <ChevronRight class="w-4 h-4" />
                                </UiButton>
                              </UiTooltipTrigger>
                              <UiTooltipContent>
                                <p>从排歌表中移除</p>
                              </UiTooltipContent>
                            </UiTooltip>
                          </UiTooltipProvider>
                        </template>
                      </MusicCard>
                    </UiContextMenuTrigger>
                    <UiContextMenuContent>
                      <UiContextMenuItem @click="move(song, -1)">
                        <ArrowUp class="mr-1 h-4 w-4" />
                        上移
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="move(song, 1)">
                        <ArrowDown class="mr-1 h-4 w-4" />
                        下移
                      </UiContextMenuItem>
                      <UiContextMenuSeparator />
                      <UiContextMenuItem @click="removeFromArrangement(song)">
                        <ArrowRight class="mr-1 h-4 w-4" />
                        从排歌表中移除
                      </UiContextMenuItem>
                    </UiContextMenuContent>
                  </UiContextMenu>
                </li>
              </TransitionGroup>
            </VueDraggable>
            <div v-if="arrangement?.songs.length === 0" class="h-16">
              排歌表中暂无歌曲，请从已审核中添加~
            </div>
          </UiScrollArea>
        </div>
      </UiCardContent>
      <UiButton
        v-if="arrangement?.songs.length === 0" variant="destructive" class="absolute right-5 bottom-5"
        :disable="removeArrangementLoading" @click="removeArrangement"
      >
        <Loader2 v-if="removeArrangementLoading" class="w-4 h-4 mr-2 animate-spin" />
        删除排歌表
      </UiButton>
    </UiCard>
    <UiCard class="basis-1/2 relative pt-4 pb-6 lg:pb-0">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row px-4 pt-3 lg:px-6 lg:pt-6">
        <div class="space-y-1">
          <UiCardTitle class="flex flex-row">
            <span class="icon-[tabler--list] mr-2" />
            总歌单
          </UiCardTitle>
        </div>
        <UiButton variant="secondary" class="self-center my-[-10px] ml-auto" @click="navigateTo('/manage/review')">
          进入审歌模式
        </UiButton>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6">
        <UiTabs default-value="approved">
          <UiTabsList class="grid grid-cols-3">
            <UiTabsTrigger value="approved">
              已审核
              <UiBadge variant="secondary" class="ml-2 self-center">
                {{ approvedList.length }}
              </UiBadge>
            </UiTabsTrigger>
            <UiTabsTrigger value="unset">
              待审核
              <UiBadge variant="secondary" class="ml-2 self-center">
                {{ unsetList.length }}
              </UiBadge>
            </UiTabsTrigger>
            <UiTabsTrigger value="rejected">
              已拒绝
              <UiBadge variant="secondary" class="ml-2 self-center">
                {{ rejectedList.length }}
              </UiBadge>
            </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="approved">
            <ContentLoading v-if="listLoading" />
            <UiScrollArea v-else class="lg:h-[calc(100vh-14rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in approvedList.slice(0, showLength.approved)" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" show-grade :compact="!isDesktop">
                        <template #suffix>
                          <UiTooltipProvider>
                            <UiTooltip>
                              <UiTooltipTrigger as-child>
                                <UiButton
                                  class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                  variant="outline" size="icon" @click="addToArrangement(song)"
                                >
                                  <ChevronLeft class="w-4 h-4" />
                                </UiButton>
                              </UiTooltipTrigger>
                              <UiTooltipContent>
                                <p>加入排歌表</p>
                              </UiTooltipContent>
                            </UiTooltip>
                          </UiTooltipProvider>
                        </template>
                      </MusicCard>
                    </UiContextMenuTrigger>
                    <UiContextMenuContent>
                      <UiContextMenuItem @click="updateSong(song, 'rejected')">
                        <X class="mr-1 h-4 w-4" />
                        拒绝
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="updateSong(song, 'unset')">
                        <ArrowDownRight class="mr-1 h-4 w-4" />
                        移入待审核
                      </UiContextMenuItem>
                      <UiContextMenuSeparator />
                      <UiContextMenuItem @click="addToArrangement(song)">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        加入排歌表
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
          <UiTabsContent value="unset">
            <ContentLoading v-if="listLoading" />
            <UiScrollArea v-else class="lg:h-[calc(100vh-17rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in unsetList.slice(0, showLength.unset)" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" show-grade :compact="!isDesktop">
                        <template #suffix>
                          <div class="flex flex-row gap-1">
                            <UiTooltipProvider>
                              <UiTooltip>
                                <UiTooltipTrigger as-child>
                                  <UiButton
                                    class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                    variant="outline" size="icon" @click="updateSong(song, 'approved')"
                                  >
                                    <Check class="w-4 h-4" />
                                  </UiButton>
                                </UiTooltipTrigger>
                                <UiTooltipContent>
                                  <p>通过</p>
                                </UiTooltipContent>
                              </UiTooltip>
                            </UiTooltipProvider>
                            <UiTooltipProvider>
                              <UiTooltip>
                                <UiTooltipTrigger as-child>
                                  <UiButton
                                    class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700"
                                    variant="outline" size="icon" @click="updateSong(song, 'rejected')"
                                  >
                                    <X class="w-4 h-4" />
                                  </UiButton>
                                </UiTooltipTrigger>
                                <UiTooltipContent>
                                  <p>拒绝</p>
                                </UiTooltipContent>
                              </UiTooltip>
                            </UiTooltipProvider>
                          </div>
                        </template>
                      </MusicCard>
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
                      <UiContextMenuSeparator />
                      <UiContextMenuItem @click="addToArrangement(song)">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        直接加入排歌表
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
            </UiScrollArea>
            <div class="float-right mt-4 flex flex-row gap-2">
              <OperationAllPopover :action="() => { approveAll() }" name="通过" />
              <OperationAllPopover :action="() => { rejectAll() }" name="拒绝" is-destructive />
            </div>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            <ContentLoading v-if="listLoading" />
            <UiScrollArea v-else class="lg:h-[calc(100vh-14rem)]">
              <TransitionGroup name="list" tag="ul">
                <li v-for="song in rejectedList.slice(0, showLength.rejected)" :key="song.id">
                  <UiContextMenu>
                    <UiContextMenuTrigger>
                      <MusicCard :song="song" show-grade :compact="!isDesktop">
                        <template #suffix>
                          <UiTooltipProvider>
                            <UiTooltip>
                              <UiTooltipTrigger as-child>
                                <UiButton
                                  class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                  variant="outline" size="icon" @click="updateSong(song, 'approved')"
                                >
                                  <Check class="w-4 h-4" />
                                </UiButton>
                              </UiTooltipTrigger>
                              <UiTooltipContent>
                                <p>通过</p>
                              </UiTooltipContent>
                            </UiTooltip>
                          </UiTooltipProvider>
                        </template>
                      </MusicCard>
                    </UiContextMenuTrigger>
                    <UiContextMenuContent>
                      <UiContextMenuItem @click="updateSong(song, 'approved')">
                        <Check class="mr-1 h-4 w-4" />
                        通过
                      </UiContextMenuItem>
                      <UiContextMenuItem @click="updateSong(song, 'unset')">
                        <ArrowUpLeft class="mr-1 h-4 w-4" />
                        移入待审核
                      </UiContextMenuItem>
                      <UiContextMenuSeparator />
                      <UiContextMenuItem @click="addToArrangement(song)">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        直接加入排歌表
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
