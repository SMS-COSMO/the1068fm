
<template>
  <div class="flex flex-row gap-5 h-screen p-5">
    <UiCard class="basis-1/4 pt-4">
      <UiCardHeader>
        <UiCardTitle>
          待审核
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiScrollArea class="h-[calc(100vh-18rem)]">
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
    </UiCard>
    <UiCard class="basis-1/2 pt-4">
      <UiCardHeader>
        <UiCardTitle>
          歌曲试听
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiScrollArea class="h-[calc(100vh-10rem)]">
          <div v-if="!searchLoading" v-for="song in searchList" :key="song">
            <MusicPlayerCard :song="song" />
          </div>
          <UiCard v-else v-for="n in 10" :key="n" class="flex items-center space-x-4 mb-4">
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

    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { isTRPCClientError } from '~/lib/utils';
import type { TSong, TSongList } from '~/lib/utils';
const { $api, $toast } = useNuxtApp();

const trpcErr = (err: unknown) => {
  if (isTRPCClientError(err)) {
    $toast.error(err.message);
  } else {
    $toast.error('未知错误');
  }
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

const updateSong = async (song: TSong, status: 'unset' | 'approved' | 'rejected' | 'used') => {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status });
    const i = songList.value.findIndex(item => item.id === song.id);
    songList.value[i].status = status;
  } catch (err) {
    trpcErr(err);
  }
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
    trpcErr(err);
  }
});
</script>