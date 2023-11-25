<template>
  <div class="flex flex-row gap-5 h-screen p-5">
    <UiCard class="basis-1/3 pt-4 relative">
      <UiCardHeader>
        <UiCardTitle>
          Calendar
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <ClientOnly fallback-tag="span" fallback="Loading Calendar">
          <DatePicker v-model="date" mode="date" color="gray" locale="zh" :attributes="calendarAttr"
            :masks="{ title: 'YYYY MMM' }" class="rounded-lg border" expanded trim-weeks borderless />
        </ClientOnly>
        <div class="flex flex-row items-center space-x-1 rounded-md text-secondary-foreground mt-4">
          <UiButton @click="arrange" :disabled="arrangeLoading" variant="outline" class="basis-1/2 px-3 shadow-none">
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
              <UiDropdownMenuCheckboxItem @click="setAutoArrangeScopeLength('day')" :checked="autoArrangeScopeLength === 'day'">
                一天
              </UiDropdownMenuCheckboxItem>
              <UiDropdownMenuCheckboxItem @click="setAutoArrangeScopeLength('week')" :checked="autoArrangeScopeLength === 'week'">
                一周
              </UiDropdownMenuCheckboxItem>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
          <UiToggle @click="showAutoArrangePreview = !showAutoArrangePreview" class="basis-1/6 shadow-none">
            预览
          </UiToggle>
        </div>
        <UiButton variant="outline" class="mt-4 w-full">
          生成微信公众号文章
        </UiButton>
      </UiCardContent>
      <UiPopover v-model:open="accountOpen">
        <UiPopoverTrigger as-child>
          <UiButton variant="outline" role="combobox" :aria-expanded="accountOpen"
            class="justify-between absolute bottom-5 left-5 w-[200px]">
            {{ userStore.userId }}
            <span class="icon-[radix-icons--caret-sort] text-lg"></span>
          </UiButton>
        </UiPopoverTrigger>
        <UiPopoverContent class="w-[200px] p-0">
          <UiCommand>
            <UiCommandGroup>
              <UiCommandItem value="logout" @select="logout">
                <span class="icon-[tabler--logout] mr-1"></span>
                登出
              </UiCommandItem>
            </UiCommandGroup>
          </UiCommand>
        </UiPopoverContent>
      </UiPopover>
    </UiCard>
    <UiCard class="basis-1/3 relative pt-4">
      <UiCardHeader>
        <UiCardTitle>
          {{ `${date.getMonth() + 1}-${date.getDate()}` }} 排歌表
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiTooltipProvider v-if="arrangement === undefined">
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiButton @click="createEmptyArrangement" variant="outline" class="w-full h-24">
                <Plus class="w-5 h-5" />
              </UiButton>
            </UiTooltipTrigger>
            <UiTooltipContent>
              <p>创建空白排歌表</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
        <div v-else>
          <UiScrollArea class="h-[calc(100vh-12rem)]">
            <TransitionGroup name="list" tag="ul">
              <li v-for="(song, index) in arrangement" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song" sorting>
                      <template #prefix>
                        <UiButton @click="move(song, -1)" variant="outline" size="icon" class="h-7 w-8">
                          <ChevronUp class="w-3.5 h-3.5" />
                        </UiButton>
                        <UiButton @click="move(song, 1)" variant="outline" size="icon" class="h-7 w-8">
                          <ChevronDown class="w-3.5 h-3.5" />
                        </UiButton>
                      </template>
                      <template #suffix>
                        <UiTooltipProvider>
                          <UiTooltip>
                            <UiTooltipTrigger as-child>
                              <UiButton @click="removeFromArrangement(song)"
                                class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700"
                                variant="outline" size="icon">
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
                    <UiContextMenuItem @click="move(song, -1)">上移</UiContextMenuItem>
                    <UiContextMenuItem @click="move(song, 1)">下移</UiContextMenuItem>
                    <UiContextMenuSeparator />
                    <UiContextMenuItem @click="removeFromArrangement(song)">从排歌表中移除</UiContextMenuItem>
                  </UiContextMenuContent>
                </UiContextMenu>
              </li>
            </TransitionGroup>
            <span v-if="arrangement?.length === 0">
              排歌表中暂无歌曲，请从已审核中添加~
            </span>
          </UiScrollArea>
        </div>
      </UiCardContent>
      <UiButton v-if="arrangement?.length === 0" @click="removeArrangement" variant="destructive"
        class="absolute right-5 bottom-5">
        删除排歌表
      </UiButton>
    </UiCard>
    <UiCard class="basis-1/3 relative pt-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row">
        <div class="space-y-1">
          <UiCardTitle>
            总歌单
          </UiCardTitle>
        </div>
        <UiButton @click="enterReview" variant="secondary" class="self-center my-[-10px] ml-auto">
          进入审歌模式
        </UiButton>
      </UiCardHeader>
      <UiCardContent>
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
            <UiScrollArea class="h-[calc(100vh-14rem)]">
              <div v-for="(song, index) in approvedList" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song">
                      <template #suffix>
                        <UiTooltipProvider>
                          <UiTooltip>
                            <UiTooltipTrigger as-child>
                              <UiButton @click="addToArrangement(song)"
                                class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                variant="outline" size="icon">
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
                    <UiContextMenuItem @click="updateSong(song, 'rejected')">拒绝</UiContextMenuItem>
                    <UiContextMenuItem @click="updateSong(song, 'unset')">移入待审核</UiContextMenuItem>
                    <UiContextMenuSeparator />
                    <UiContextMenuItem @click="addToArrangement(song)">加入排歌表</UiContextMenuItem>
                  </UiContextMenuContent>
                </UiContextMenu>
              </div>
            </UiScrollArea>
          </UiTabsContent>
          <UiTabsContent value="unset">
            <UiScrollArea class="h-[calc(100vh-18rem)]">
              <div v-for="(song, index) in unsetList" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song">
                      <template #suffix>
                        <div class="flex flex-row gap-1">
                          <UiTooltipProvider>
                            <UiTooltip>
                              <UiTooltipTrigger as-child>
                                <UiButton @click="updateSong(song, 'approved')"
                                  class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                  variant="outline" size="icon">
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
                                <UiButton @click="updateSong(song, 'rejected')"
                                  class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700"
                                  variant="outline" size="icon">
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
                    <UiContextMenuItem @click="updateSong(song, 'approved')">通过</UiContextMenuItem>
                    <UiContextMenuItem @click="updateSong(song, 'rejected')">拒绝</UiContextMenuItem>
                    <UiContextMenuSeparator />
                    <UiContextMenuItem @click="addToArrangement(song)">直接加入排歌表</UiContextMenuItem>
                  </UiContextMenuContent>
                </UiContextMenu>
              </div>
            </UiScrollArea>
            <UiPopover v-model:open="rejectOpen">
              <UiPopoverTrigger as-child>
                <UiButton @click="rejectOpen = true" variant="outline" class="absolute right-5 bottom-5">
                  全部拒绝
                </UiButton>
              </UiPopoverTrigger>
              <UiPopoverContent class="w-60 mr-2 mb-2">
                <UiCard class="border-0 shadow-transparent">
                  <UiCardHeader class="p-2">
                    <UiCardTitle class="text-xl">
                      确定要全部拒绝吗？
                    </UiCardTitle>
                    <UiCardDescription>
                      此操作不可撤销
                    </UiCardDescription>
                  </UiCardHeader>
                  <UiCardContent class="p-2">
                    <div class="ml-auto">
                      <UiButton @click="rejectAll" variant="destructive">
                        是
                      </UiButton>
                      <UiButton @click="rejectOpen = false" variant="outline" class="ml-2">
                        取消
                      </UiButton>
                    </div>
                  </UiCardContent>
                </UiCard>
              </UiPopoverContent>
            </UiPopover>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            <UiScrollArea class="h-[calc(100vh-18rem)]">
              <div v-for="(song, index) in rejectedList" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song">
                      <template #suffix>
                        <UiTooltipProvider>
                          <UiTooltip>
                            <UiTooltipTrigger as-child>
                              <UiButton @click="updateSong(song, 'approved')"
                                class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                                variant="outline" size="icon">
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
                    <UiContextMenuItem @click="updateSong(song, 'approved')">通过</UiContextMenuItem>
                    <UiContextMenuItem @click="updateSong(song, 'unset')">移入待审核</UiContextMenuItem>
                    <UiContextMenuSeparator />
                    <UiContextMenuItem @click="addToArrangement(song)">直接加入排歌表</UiContextMenuItem>
                  </UiContextMenuContent>
                </UiContextMenu>
              </div>
            </UiScrollArea>
          </UiTabsContent>
        </UiTabs>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { getDateString } from '~/lib/utils';
import type { TSong, TSongList, TArrangementList } from '~/lib/utils';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Check, Plus, Loader2 } from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import dayjs from 'dayjs';
import 'v-calendar/style.css';
const { $api, $toast } = useNuxtApp();

const userStore = useUserStore();

const accountOpen = ref(false);
const rejectOpen = ref(false);

type TArrange = 'day' | 'week';
const autoArrangeScopeText = {
  'day': '一天',
  'week': '一周',
};
const autoArrangeScopeLength = ref<TArrange>(userStore.autoArrange);
const setAutoArrangeScopeLength = (newVal: TArrange) => {
  autoArrangeScopeLength.value = newVal;
  userStore.changeAutoArrange(newVal);
};

const showAutoArrangePreview = ref(false);
const arrangeScope = computed(() => {
  let maxDate = dayjs('2000-01-01');
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
  }
});

const arrangeLoading = ref(false);
const arrange = async () => {
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
      songs: songs,
    });
    for (const song of songs)
      await updateSong(song, 'used');
    i = i.add(1, 'd');
  }
  arrangeLoading.value = false;
  $toast.success('排歌成功');
};

const enterReview = () => {
  const router = useRouter();
  router.push('/review');
};

const songList = ref<TSongList>([]);
const unsetList = computed(
  () => songList.value.filter(s => (s.status === 'unset'))
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) // Oldest first
);
const approvedList = computed(
  () => songList.value.filter(s => (s.status === 'approved'))
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) // Oldest first
);
const rejectedList = computed(
  () => songList.value.filter(s => (s.status === 'rejected'))
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) // Newest first
);

const arrangementList = ref<TArrangementList>([]);
const arrangement = computed(
  () => arrangementList.value.find(e => e.date === dateString.value)?.songs
);

const date = ref(new Date());
const dateString = computed(() => getDateString(date.value));

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
        }
      },
      dates: new Date(arrangement.date),
    });
  }

  if (showAutoArrangePreview.value) {
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

const updateSong = async (song: TSong, status: 'unset' | 'approved' | 'rejected' | 'used') => {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    const i = songList.value.findIndex(item => item.id === song.id);
    songList.value[i].status = status;
  } catch (err) {
    useErrorHandler(err)
  }
};

const addToArrangement = async (song: TSong) => {
  const i = arrangementList.value.findIndex(e => e.date === dateString.value);
  if (!arrangementList.value[i])
    return;

  arrangementList.value[i].songs.push(song);
  try {
    await $api.arrangement.modifySongList.mutate({
      date: dateString.value,
      newSongList: arrangementList.value[i].songs.map(item => item.id) ?? []
    });

    await updateSong(song, 'used');
  } catch (err) {
    useErrorHandler(err)
    arrangementList.value[i].songs.pop();
  }
};

const removeFromArrangement = async (song: TSong) => {
  const i = arrangementList.value.findIndex(e => e.date === dateString.value);
  if (!arrangementList.value[i])
    return;

  const j = arrangementList.value[i].songs.indexOf(song);
  arrangementList.value[i].songs.splice(j, 1);
  try {
    await $api.arrangement.modifySongList.mutate({
      date: dateString.value,
      newSongList: arrangementList.value[i].songs.map(item => item.id) ?? []
    });

    await updateSong(song, 'approved');
  } catch (err) {
    useErrorHandler(err)
    arrangementList.value[i].songs.splice(j, 1, song);
  }
};

const removeArrangement = async () => {
  try {
    await $api.arrangement.remove.mutate({ date: dateString.value });
    const i = arrangementList.value.findIndex(item => item.date === dateString.value);
    arrangementList.value.splice(i, 1);
  } catch (err) {
    useErrorHandler(err)
  }
};

const move = async (song: TSong, upset: 1 | -1) => {
  const i = arrangementList.value.findIndex(e => e.date === dateString.value);
  if (!arrangementList.value[i])
    return;

  const j = arrangementList.value[i].songs.indexOf(song);
  if (j + upset >= 0 && j + upset < arrangementList.value[i].songs.length)
    [arrangementList.value[i].songs[j], arrangementList.value[i].songs[j + upset]] =
      [arrangementList.value[i].songs[j + upset], arrangementList.value[i].songs[j]]

  try {
    await $api.arrangement.modifySongList.mutate({
      date: dateString.value,
      newSongList: arrangementList.value[i].songs.map(item => item.id) ?? []
    });
  } catch (err) {
    useErrorHandler(err)
    [arrangementList.value[i].songs[j], arrangementList.value[i].songs[j + upset]] =
      [arrangementList.value[i].songs[j + upset], arrangementList.value[i].songs[j]]
  }
}

const createEmptyArrangement = async () => {
  try {
    await $api.arrangement.create.mutate({ date: dateString.value, songIds: [] });
    arrangementList.value.push({
      date: dateString.value,
      songs: [],
    });
  } catch (err) {
    useErrorHandler(err)
  }
};

const rejectAll = async () => {
  rejectOpen.value = false;
  for (let song of songList.value)
    await updateSong(song, 'rejected');
};

const logout = () => {
  const router = useRouter();
  userStore.logout();
  router.push('/login');
};

onMounted(async () => {
  try {
    await $api.user.tokenValidity.query();
  } catch (err) {
    const router = useRouter();
    router.push('/login');
  }

  try {
    songList.value = await $api.song.list.query();
    arrangementList.value = await $api.arrangement.list.query();
  } catch (err) {
    useErrorHandler(err)
  }
});
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

<style scoped>
.list-enter-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>