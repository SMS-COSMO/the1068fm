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
        <UiCalendar class="rounded-lg border"></UiCalendar>
      </UiCardContent>
      <UiPopover v-model:open="open">
        <UiPopoverTrigger as-child>
          <UiButton variant="outline" role="combobox" :aria-expanded="open"
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
                <MusicCard :song="song" editable></MusicCard>
              </div>
            </UiScrollArea>
            <UiButton variant="destructive" class="absolute right-5 bottom-5">
              全部拒绝
            </UiButton>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            <UiScrollArea class="h-[calc(100vh-18rem)]">
              <div v-for="(song, index) in songList.filter(s => (s.status === 'rejected'))" :key="index">
                <MusicCard :song="song" editable></MusicCard>
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
import { isTRPCClientError } from '~/lib/utils';
import type { TSongList } from '~/lib/utils';
const { $api, $toast } = useNuxtApp();
const open = ref(false);
const userStore = useUserStore();

const songList = ref<TSongList>([]);

onMounted(async () => {
  try {
    await $api.user.tokenValidity.query();
  } catch (err) {
    const router = useRouter();
    router.push('/login');
  }

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

const logout = () => {
  const router = useRouter();
  userStore.logout();
  router.push('/login');
};
</script>