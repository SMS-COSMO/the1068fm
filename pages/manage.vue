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
                    <div class="flex flex-row gap-1 w-[100px]">
                      <UiButton class="basis-1/2 hover:bg-green-200 hover:border-green-400 hover:text-green-700"
                        variant="outline" size="icon">
                        <ChevronLeft class="w-4 h-4" />
                      </UiButton>
                      <UiButton @click="reject(song)"
                        class="basis-1/2 hover:bg-red-200 hover:border-red-400 hover:text-red-700" variant="outline">
                        <X class="w-4 h-4" />
                      </UiButton>
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
import type { TSong, TSongList } from '~/lib/utils';
const { $api, $toast } = useNuxtApp();
import { ChevronLeft, X } from 'lucide-vue-next';

const accountOpen = ref(false);
const rejectOpen = ref(false);
const userStore = useUserStore();

const songList = ref<TSongList>([]);

const reject = async (song: TSong) => {
  try {
    await $api.song.modifyStatus.mutate({ id: song.id, status: 'rejected' });
    await updateSongList();
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
    await reject(song);

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
  } catch (err) {
    if (isTRPCClientError(err)) {
      $toast.error(err.message);
    } else {
      $toast.error('未知错误');
    }
  }
});
</script>