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
              {{ songListInfo?.allSongs }}
            </UiCardHeader>
            <UiCardContent class="pt-0 pb-0">
              <span class="text-md">已收集歌曲</span>
            </UiCardContent>
          </UiCard>
          <UiCard class="shadow p-0 pt-1 pb-2">
            <UiCardHeader class="pt-1 pb-0 text-3xl font-bold">
              {{ songListInfo?.reviewedSongs }}
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
          <UiButton @click="navigateTo('/submit')" class="w-auto shadow text-md p-0">
            <Music4 class="w-5 h-5 mr-1" />
            <span class="align-bottom">
              歌曲投稿
            </span>
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

      <UiCard class="my-6 shadow">
        <UiCardHeader>
          <UiInput v-model="searchContent" placeholder="搜索歌单" class="text-md" />
        </UiCardHeader>
        <UiCardContent>
          <div v-for="(song, index) in processedListData" :key="index">
            <MusicCard :song="song" />
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music4 } from 'lucide-vue-next';
import type { TSafeSongList, TSongListInfo } from '~/types';
import { useFuse } from '@vueuse/integrations/useFuse';
const { $api } = useNuxtApp();

const songList = ref<TSafeSongList>([]);
const songListInfo = ref<TSongListInfo>();

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

onMounted(async () => {
  try {
    songList.value = (await $api.song.listSafe.query()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } catch (err) {
    useErrorHandler(err)
  }
  try {
    songListInfo.value = await $api.song.info.query();
  } catch (err) {
    useErrorHandler(err)
  }
});
</script>
