<template>
  <main
    class="p-5 lg:p-10 flex flex-col lg:grid lg:grid-cols-2 max-w-screen-sm mx-auto lg:max-w-screen-xl lg:mx-auto lg:h-screen gap-8"
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
          <SubmitDialog>
            <Button class="w-full text-xl h-full font-bold" :disabled="!canSubmit">
              <Icon name="lucide:music-4" size="26" class="mr-2" />
              投稿
            </Button>
          </SubmitDialog>
        </ClientOnly>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <Button variant="outline">
          <Icon name="lucide:circle-help" class="mr-2" />
          <span>
            规则介绍
          </span>
        </Button>
        <Button variant="outline">
          <Icon name="lucide:info" class="mr-2" />
          关于我们
        </Button>
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
          <Button v-if="userStore.permissions.includes('admin')" variant="outline" size="sm" @click="admin">
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
      <Tabs default-value="list">
        <div class="sticky top-4 lg:top-0 bg-white">
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
        </div>
        <TabsContent value="list" class="space-y-3">
          <Input placeholder="搜索歌曲" class="mt-1" />
          <SongCard v-for="song in songList" :key="song.id" :song />
        </TabsContent>
        <TabsContent value="arrangement">
          arrangement
        </TabsContent>
        <TabsContent value="mine" class="space-y-3">
          <SongCard v-for="song in mySongList" :key="song.id" :song />
        </TabsContent>
      </Tabs>
    </section>
  </main>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { $trpc } = useNuxtApp();

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

if (!userStore.loggedIn) {
  navigateTo('/login');
} else {
  try {
    await $trpc.user.tokenValidity.query();
    await songListSuspense();
    await canSubmitSuspense();
    await mySongListSuspense();
  } catch {
    navigateTo('/login');
  }
}

function logout() {
  userStore.logout();
  toast.success('登出成功');
  navigateTo('/login');
}

function admin() {
  navigateTo('/admin');
}
</script>
