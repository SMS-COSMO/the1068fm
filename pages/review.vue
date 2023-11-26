
<template>
  <div class="flex flex-row gap-5 h-screen p-5">
    <UiCard class="basis-1/4 pt-4 relative">
      <UiCardHeader>
        <UiCardTitle class="flex">
          待审核
          <UiBadge variant="secondary" class="ml-2 self-center">
            {{ unsetList.length }}
          </UiBadge>
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiScrollArea class="h-[calc(100vh-10rem)]">
          <div v-for="(song, index) in unsetList" :key="index">
            <UiContextMenu>
              <UiContextMenuTrigger>
                <MusicCard @click="selectedSong = song" :song="song" :selected="selectedSong === song"
                  class="cursor-pointer" />
              </UiContextMenuTrigger>
              <UiContextMenuContent>
                <UiContextMenuItem @click="updateSong(song, 'approved')">通过</UiContextMenuItem>
                <UiContextMenuItem @click="updateSong(song, 'unset')">拒绝</UiContextMenuItem>
              </UiContextMenuContent>
            </UiContextMenu>
          </div>
        </UiScrollArea>
      </UiCardContent>
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
    </UiCard>
    <UiCard class="basis-1/2 pt-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row">
        <UiCardTitle>
          歌曲试听
        </UiCardTitle>
        <div v-if="selectedSong" class="ml-auto h-4">
          <UiButton variant="secondary" size="icon" @click="reviewSong(selectedSong, 'approved');"
            class="w-20 my-[-10px] hover:bg-green-200 hover:border-green-400 hover:text-green-700">
            <Check class="w-5 h-5" />
          </UiButton>
          <UiButton variant="secondary" size="icon" @click="reviewSong(selectedSong, 'rejected');"
            class="w-20 ml-3 my-[-10px] hover:bg-red-200 hover:border-red-400 hover:text-red-700">
            <X class="w-5 h-5" />
          </UiButton>
        </div>
      </UiCardHeader>
      <UiCardContent>
        <UiScrollArea class="h-[calc(100vh-10rem)]">
          <div v-if="!searchLoading" v-for="song in searchList" :key="song">
            <MusicPlayerCard :song="song" />
          </div>
          <UiCard v-if="searchLoading && selectedSong" v-for="n in 10" :key="n" class="flex items-center space-x-4 mb-4">
            <UiCardHeader class="items-start gap-4 space-y-0 flex-row w-full">
              <UiSkeleton class="h-20 w-20 rounded-sm" />
              <div class="space-y-2 w-full">
                <UiSkeleton class="h-5 w-3/5" />
                <UiSkeleton class="h-5 w-1/5" />
                <UiSkeleton class="h-5 w-full" />
              </div>
            </UiCardHeader>
          </UiCard>
        </UiScrollArea>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-1/4 pt-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row">
        <div class="space-y-1">
          <UiCardTitle>
            已审核
          </UiCardTitle>
        </div>
        <UiButton @click="enterManage" variant="secondary" class="self-center my-[-10px] ml-auto">
          返回排歌模式
        </UiButton>
      </UiCardHeader>
      <UiCardContent>
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
            <UiScrollArea class="h-[calc(100vh-14rem)]">
              <div v-for="(song, index) in approvedList" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song" />
                  </UiContextMenuTrigger>
                  <UiContextMenuContent>
                    <UiContextMenuItem @click="updateSong(song, 'rejected')">拒绝</UiContextMenuItem>
                    <UiContextMenuItem @click="updateSong(song, 'unset')">移入待审核</UiContextMenuItem>
                  </UiContextMenuContent>
                </UiContextMenu>
              </div>
            </UiScrollArea>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            <UiScrollArea class="h-[calc(100vh-14rem)]">
              <div v-for="(song, index) in rejectedList" :key="index">
                <UiContextMenu>
                  <UiContextMenuTrigger>
                    <MusicCard :song="song" />
                  </UiContextMenuTrigger>
                  <UiContextMenuContent>
                    <UiContextMenuItem @click="updateSong(song, 'approved')">通过</UiContextMenuItem>
                    <UiContextMenuItem @click="updateSong(song, 'unset')">移入待审核</UiContextMenuItem>
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
import { X, Check } from 'lucide-vue-next';
import type { TSong, TSongList } from '~/lib/utils';
const { $api } = useNuxtApp();

definePageMeta({
  pageTransition: {
    name: 'slide-down',
    mode: 'out-in'
  }
});

const rejectOpen = ref(false);

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

const selectedSong = ref<TSong>();
const searchLoading = ref(false);
const searchList = computedAsync(
  async () => {
    searchLoading.value = true;
    const formData = new FormData();
    formData.append('input', `${selectedSong.value?.name ?? ''} ${selectedSong.value?.creator ?? ''}`);
    formData.append('filter', 'name');
    formData.append('type', 'qq');

    const data: any = (await useFetch('/liuzhijin', {
      method: 'post',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      mode: 'cors',
    })).data;
    searchLoading.value = false;
    return JSON.parse(data.value).data;
  },
);

const rejectAll = async () => {
  rejectOpen.value = false;
  for (let song of songList.value)
    await updateSong(song, 'rejected');
};

const updateSong = async (song: TSong, status: 'unset' | 'approved' | 'rejected' | 'used') => {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    const i = songList.value.findIndex(item => item.id === song.id);
    songList.value[i].status = status;
  } catch (err) {
    useErrorHandler(err)
  }
};

const reviewSong = async (song: TSong, status: 'unset' | 'approved' | 'rejected' | 'used') => {
  await updateSong(song, status);
  selectedSong.value = unsetList.value[unsetList.value.indexOf(song) + 1];
};

const enterManage = () => {
  const router = useRouter();
  router.push('/manage');
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
  } catch (err) {
    useErrorHandler(err)
  }
});
</script>