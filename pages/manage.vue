<template>
  <div class="flex flex-row gap-5 h-screen p-5">
    <UiCard class="basis-1/3 pt-4 relative">
      <UiCardHeader>
        <UiCardTitle>
          Calendar
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <ClientOnly fallback-tag="span" fallback="Loading Calendar">
          <DatePicker v-model="date" mode="date" color="gray" locale="zh" :attributes="calendarAttr"
            :masks="{ title: 'YYYY MMM' }" class="rounded-lg border" expanded trim-weeks borderless />
        </ClientOnly>
        <UiPopover v-model:open="arrangementOpen">
          <UiPopoverTrigger as-child>
            <UiButton variant="outline" role="combobox" :aria-expanded="arrangementOpen"
              class="justify-between w-full mt-4">
              一键排歌
              <span class="icon-[radix-icons--caret-down] text-lg"></span>
            </UiButton>
          </UiPopoverTrigger>
          <UiPopoverContent class="p-0">
            <UiCommand>
              <UiCommandGroup>
                <UiCommandItem value="oneDay">
                  一天
                </UiCommandItem>
                <UiCommandItem value="oneWeek">
                  一周
                </UiCommandItem>
                <UiCommandItem value="twoWeeks">
                  两周
                </UiCommandItem>
              </UiCommandGroup>
            </UiCommand>
          </UiPopoverContent>
        </UiPopover>
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
          本周排歌表
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <UiTooltipProvider v-if="arrangementList.find(e => e.date === getDateString(date)) === undefined">
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
          <div v-for="(song, index) in arrangementList.find(e => e.date === getDateString(date))?.songIds" :key="index">
            {{ song }}
            <!-- <MusicCard :song="song">
              <template #action>
                <UiTooltipProvider>
                  <UiTooltip>
                    <UiTooltipTrigger as-child>
                      <UiButton @click="updateSong(song, 'rejected')"
                        class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700" variant="outline"
                        size="icon">
                        <ChevronRight class="w-4 h-4" />
                      </UiButton>
                    </UiTooltipTrigger>
                    <UiTooltipContent>
                      <p>从排歌表中移除</p>
                    </UiTooltipContent>
                  </UiTooltip>
                </UiTooltipProvider>
              </template>
            </MusicCard> -->
          </div>
          <span v-if="arrangementList.find(e => e.date === getDateString(date))?.songIds?.length === 0">
            排歌表中暂无歌曲，从总歌单中添加
          </span>
        </div>
      </UiCardContent>
      <UiButton class="absolute right-5 bottom-5">
        保存修改
      </UiButton>
    </UiCard>
    <UiCard class="basis-1/3 relative pt-4">
      <UiCardHeader>
        <UiCardTitle>
          总歌单
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <UiTabs default-value="unset">
          <UiTabsList class="grid grid-cols-3">
            <UiTabsTrigger value="unset">
              待审核
            </UiTabsTrigger>
            <UiTabsTrigger value="rejected">
              已拒绝
            </UiTabsTrigger>
            <UiTabsTrigger value="used">
              已使用
            </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="unset">
            <UiScrollArea class="h-[calc(100vh-18rem)]">
              <div v-for="(song, index) in songList.filter(s => (s.status === 'unset'))" :key="index">
                <MusicCard :song="song">
                  <template #action>
                    <div class="flex flex-row gap-1">
                      <UiTooltipProvider>
                        <UiTooltip>
                          <UiTooltipTrigger as-child>
                            <UiButton class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                              variant="outline" size="icon">
                              <ChevronLeft class="w-4 h-4" />
                            </UiButton>
                          </UiTooltipTrigger>
                          <UiTooltipContent>
                            <p>加入今日排歌表</p>
                          </UiTooltipContent>
                        </UiTooltip>
                      </UiTooltipProvider>
                      <UiTooltipProvider>
                        <UiTooltip>
                          <UiTooltipTrigger as-child>
                            <UiButton @click="updateSong(song, 'rejected')"
                              class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700" variant="outline"
                              size="icon">
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
              </div>
            </UiScrollArea>
            <UiPopover v-model:open="rejectOpen">
              <UiPopoverTrigger as-child>
                <UiButton @click="rejectOpen = true" variant="destructive" class="absolute right-5 bottom-5">
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
                      <UiButton @click="rejectAll">
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
              <div v-for="(song, index) in songList.filter(s => (s.status === 'rejected'))" :key="index">
                <MusicCard :song="song">
                  <template #action>
                    <UiTooltipProvider>
                      <UiTooltip>
                        <UiTooltipTrigger as-child>
                          <UiButton class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                            variant="outline" size="icon">
                            <Check @click="updateSong(song, 'unset')" class="w-4 h-4" />
                          </UiButton>
                        </UiTooltipTrigger>
                        <UiTooltipContent>
                          <p>重新加入待审核列表</p>
                        </UiTooltipContent>
                      </UiTooltip>
                    </UiTooltipProvider>
                  </template>
                </MusicCard>
              </div>
            </UiScrollArea>
          </UiTabsContent>
          <UiTabsContent value="used">
            <UiScrollArea class="h-[calc(100vh-18rem)]">
              <div v-for="(song, index) in songList.filter(s => (s.status === 'used'))" :key="index">
                <MusicCard :song="song"></MusicCard>
              </div>
            </UiScrollArea>
          </UiTabsContent>
        </UiTabs>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { isTRPCClientError, getDateString } from '~/lib/utils';
import type { TSong, TSongList, TArrangementList } from '~/lib/utils';
import { ChevronLeft, ChevronRight, X, Check, Plus } from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
const { $api, $toast } = useNuxtApp();

const userStore = useUserStore();

const accountOpen = ref(false);
const rejectOpen = ref(false);
const arrangementOpen = ref(false);

const songList = ref<TSongList>([]);
const arrangementList = ref<TArrangementList>([]);
const date = ref(new Date());

const calendarAttr = computed(() => {
  const res = [];
  for (const arrangement of arrangementList.value) {
    res.push({
      dot: {
        style: {
          backgroundColor: (arrangement.songIds?.length ?? 0) <= 8 ? 'orange' : 'green',
        }
      },
      dates: new Date(arrangement.date)
    })
  }
  return res;
});

const updateSong = async (song: TSong, status: 'unset' | 'rejected' | 'used') => {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    await updateSongList();

    if (status === 'unset')
      $toast.message(`成功将《${song.name}》移入待审核列表`);
    if (status === 'rejected')
      $toast.message(`成功拒绝《${song.name}》`);
    if (status === 'used')
      $toast.message(`成功将《${song.name}》加入今日排歌单`);
  } catch (err) {
    if (isTRPCClientError(err)) {
      $toast.error(err.message);
    } else {
      $toast.error('未知错误');
    }
  }
};

const createEmptyArrangement = async () => {
  try {
    const d = getDateString(date.value);
    await $api.arrangement.create.mutate({ date: d, songIds: [] });
    arrangementList.value.push({
      date: d,
      songIds: [],
    });
  } catch (err) {
    if (isTRPCClientError(err)) {
      $toast.error(err.message);
    } else {
      $toast.error('未知错误');
    }
  }
};

const rejectAll = async () => {
  rejectOpen.value = false;
  for (let song of songList.value)
    await updateSong(song, 'rejected');

  await updateSongList();
};

const logout = () => {
  const router = useRouter();
  userStore.logout();
  router.push('/login');
};

const updateSongList = async () => {
  songList.value = (await $api.song.list.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
};

onMounted(async () => {
  try {
    await $api.user.tokenValidity.query();
  } catch (err) {
    const router = useRouter();
    router.push('/login');
  }

  try {
    await updateSongList();
    arrangementList.value = await $api.arrangement.list.query();
  } catch (err) {
    if (isTRPCClientError(err)) {
      $toast.error(err.message);
    } else {
      $toast.error('未知错误');
    }
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