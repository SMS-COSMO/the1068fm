<template>
  <div class="mx-9">
    <div class="font-bold text-4xl mb-10 mt-16">
      点歌
    </div>

    <div class="flex flex-row gap-5">
      <UiCard class="h-30 basis-1/2 shadow">
        <UiCardHeader class="pb-2 text-lg">
          目前歌曲队列
        </UiCardHeader>
        <UiCardContent>
          <span class="font-bold text-3xl">10</span>
        </UiCardContent>
      </UiCard>
      <UiButton @click="submit" class="h-30 basis-1/2 shadow text-2xl">
        <span class="icon-[tabler--music] mr-1"></span>
        歌曲投稿
      </UiButton>
    </div>

    <UiCard class="my-6 shadow">
      <UiCardHeader>
        <UiInput placeholder="搜索歌单" class="text-md" />
      </UiCardHeader>
      <UiCardContent>
        <div v-for="(song, index) in songList.filter(s => (s.status === 'unset'))" :key="index">
          <MusicCard :song="song"></MusicCard>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { isTRPCClientError } from '~/lib/utils';
import type { TSongList } from '~/lib/utils';
const { $api, $toast } = useNuxtApp();

const songList = ref<TSongList>([]);

const submit = () => {
  const router = useRouter();
  router.push('/submit');
};

onMounted(async () => {
  try {
    songList.value = (await $api.song.list.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } catch (err) {
    if (isTRPCClientError(err)) {
      $toast.error(err.message);
    } else {
      $toast.error('未知错误');
    }
  }
});
</script>
