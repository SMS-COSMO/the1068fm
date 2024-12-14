<template>
  <main
    class="p-5 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 max-w-screen-sm mx-auto lg:max-w-screen-xl lg:mx-auto lg:h-screen gap-4 lg:gap-8"
  >
    <section class="flex flex-col gap-3 lg:self-center">
      <LogosCombined class="w-full" />

      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-rows-2 gap-3">
          <Button class="block items-center gap-2 h-full" variant="outline">
            <div class="text-xs">
              本周已收集歌曲
            </div>
            <div class="text-2xl font-bold">
              {{ songList?.length || 0 }}
            </div>
          </Button>
          <TimeAvailabilityDialog>
            <TimeAvailability is-card />
          </TimeAvailabilityDialog>
        </div>
        <ClientOnly>
          <template #fallback>
            <Button class="w-full text-xl h-full font-bold" :disabled="!canSubmit">
              <Icon name="lucide:music-4" size="26" class="mr-2" />
              投稿
            </Button>
          </template>
          <SongSubmitDialog>
            <Button class="w-full text-xl h-full font-bold" :disabled="!canSubmit">
              <Icon name="lucide:music-4" size="26" class="mr-2" />
              投稿
            </Button>
          </SongSubmitDialog>
        </ClientOnly>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <Button variant="outline">
          <Icon name="lucide:circle-help" class="mr-2" />
          <span>
            规则介绍
          </span>
        </Button>
        <HomeAboutUs />
      </div>

      <div class="flex items-center gap-4 mt-4">
        <Avatar>
          <Icon name="lucide:circle-user" size="20" />
        </Avatar>

        <div class="flex flex-col">
          <span>{{ userStore.name }}</span>
          <span class="text-xs text-muted-foreground">
            {{ userStore.id }}
          </span>
        </div>

        <div class="ml-auto flex gap-2">
          <DarkModeToggle />
          <Button v-if="userStore.permissions.includes('admin')" variant="outline" size="sm" @click="navigateTo('/admin')">
            <Icon name="lucide:user-cog" class="mr-1" />
            管理
          </Button>
          <Button variant="outline" size="sm" @click="logout">
            <Icon name="lucide:log-out" class="mr-1" />
            登出
          </Button>
        </div>
      </div>
    </section>

    <section class="lg:overflow-scroll lg:px-4">
      <Tabs v-model="selectedTab" default-value="list">
        <div class="sticky pt-4 top-0 bg-background z-50 -mx-5 px-5 lg:p-0 lg:m-0">
          <TabsList class="grid grid-cols-3">
            <TabsTrigger value="list">
              已收集投稿
            </TabsTrigger>
            <TabsTrigger value="arrangement">
              歌单
            </TabsTrigger>
            <TabsTrigger value="mine">
              我的投稿
            </TabsTrigger>
          </TabsList>
          <div v-if="selectedTab === 'list'" class="w-full items-center mt-1 relative bg-background">
            <Input id="search" v-model="searchPrompt" type="text" placeholder="搜索歌曲" class="pl-8" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center pl-3">
              <Icon name="lucide:search" class="text-muted-foreground" />
            </span>
          </div>
        </div>
        <TabsContent value="list" class="space-y-3">
          <SongCard v-for="song in filteredList" :key="song.id" :song />
        </TabsContent>
        <TabsContent value="arrangement">
          <DatePicker
            v-model="selectedDate"
            mode="date"
            view="weekly"
            borderless
            expanded
            title-position="left"
            is-required
            :attributes="calendarAttr"
            :is-dark="isDark"
            class="mb-4 !bg-background"
          />
          <ul class="gap-3 flex flex-col">
            <li v-for="song in arrangementListSongs" :key="song.id">
              <SongCard :song is-arrangement />
            </li>
          </ul>
        </TabsContent>
        <TabsContent value="mine" class="space-y-3">
          <SongCard v-for="song in mySongList" :key="song.id" :song />
        </TabsContent>
      </Tabs>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';
import { useFuse, type UseFuseOptions } from '@vueuse/integrations/useFuse';
import { DatePicker } from '@ztl-uwu/v-calendar';

const userStore = useUserStore();
const { $trpc } = useNuxtApp();

const selectedDate = ref(new Date());
const isDark = computed(() => useColorMode().preference === 'dark');

const { data: songList, suspense: songListSuspense } = useQuery({
  queryFn: () => $trpc.song.listSafe.query(),
  queryKey: ['song.listSafe'],
  refetchInterval: 10000,
  refetchIntervalInBackground: false,
});

const { data: mySongList, suspense: mySongListSuspense } = useQuery({
  queryFn: () => $trpc.song.listMine.query(),
  queryKey: ['song.listMine'],
});

const { data: canSubmit, suspense: canSubmitSuspense } = useQuery({
  queryFn: () => $trpc.song.canSubmit.query(),
  queryKey: ['song.canSubmit'],
  refetchInterval: 10000,
  refetchIntervalInBackground: false,
});

const { data: arrangementList, suspense: arrangementListSuspense } = useQuery({
  queryFn: () => $trpc.arrangements.listSafe.query(),
  queryKey: ['arrangements.listSafe'],
  refetchIntervalInBackground: false,
});

function getDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

const arrangementListSongs = computed(
  () => arrangementList.value?.find(e => e.date === getDateString(selectedDate.value))?.songs || [],
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

if (!userStore.loggedIn) {
  navigateTo('/login');
} else {
  try {
    await $trpc.user.tokenValidity.query();
    await songListSuspense();
    await canSubmitSuspense();
    await mySongListSuspense();
    await arrangementListSuspense();
  } catch {
    navigateTo('/login');
  }
}

function logout() {
  userStore.logout();
  toast.success('登出成功');
  navigateTo('/login');
}

type TLists = RouterOutput['song']['listSafe'];

const fuseOptions: UseFuseOptions<TLists[0]> = {
  fuseOptions: {
    keys: ['name', 'creator'],
    shouldSort: true,
  },
  matchAllWhenSearchEmpty: true,
};

const searchPrompt = ref('');
const fuse = songList.value === undefined
  ? useFuse<TLists[0]>(searchPrompt, [], fuseOptions)
  : useFuse<TLists[0]>(searchPrompt, songList, fuseOptions);

const filteredList = computed<TLists>(() => fuse.results.value.map(e => e.item));

const selectedTab = ref<'list' | 'arrangement' | 'mine'>('list');
</script>
