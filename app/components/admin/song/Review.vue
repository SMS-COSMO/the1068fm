<template>
  <div class="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4">
    <Button
      variant="outline"
      :disable="approvePending"
      @click="approve({ id: song.id })"
    >
      <Icon v-if="approvePending" name="lucide:loader-circle" class="mr-2 animate-spin" />
      <Icon name="lucide:check" size="17" />
    </Button>
    <Button
      variant="outline"
      :disable="rejectPending"
      @click="reject({ id: song.id, rejectMessage: rejectMessage.trim() })"
    >
      <Icon v-if="rejectPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
      <Icon name="lucide:x" size="17" />
    </Button>
    <Input v-model="rejectMessage" placeholder="拒绝理由（≥ 4个字符）" />
  </div>
  <div v-if="!isFetching">
    <div v-if="previewList && previewList.length" class="flex flex-col gap-3 p-4">
      <NuxtLink
        v-for="preview of previewList"
        :key="preview.mid"
        :to="`https://y.qq.com/n/ryqq/songDetail/${preview.mid}`"
        target="_blank"
        class="w-full"
      >
        <button class="flex h-auto w-full cursor-pointer gap-4 rounded-lg border p-4 shadow-sm transition-colors hover:bg-muted">
          <Avatar class="size-9 rounded">
            <NuxtImg :src="preview.pic" />
            <Icon name="lucide:music" size="20" />
          </Avatar>

          <div class="text-start">
            <CardTitle>
              {{ preview.name }}
            </CardTitle>
            <CardDescription>
              {{ preview.singer }}
            </CardDescription>
          </div>
        </button>
      </NuxtLink>
      <span class="mt-2 text-right text-xs text-muted-foreground">点击歌曲跳转到 QQ 音乐试听</span>
    </div>
    <div v-else class="flex h-[calc(100svh-10rem)] w-full flex-col items-center justify-center">
      无搜索结果。
    </div>
  </div>
  <div v-else class="flex h-[calc(100svh-10rem)] w-full flex-col items-center justify-center">
    <Icon name="lucide:loader-circle" class="animate-spin" size="35" />
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const { song } = defineProps<{
  song: RouterOutput['song']['listReview'][0];
}>();

const { $trpc } = useNuxtApp();

const qqSearchKey = computed(() => `${song.name} ${song.creator}`);

const queryClient = useQueryClient();
const { isFetching, data: previewList } = useQuery({
  queryFn: () => $trpc.song.qqSearch.query({ key: qqSearchKey.value }),
  queryKey: ['song.qqSearch'],
  refetchOnWindowFocus: false,
});

const rejectMessage = ref('');

// new song selected
watch(() => song, () => {
  queryClient.invalidateQueries({ queryKey: ['song.qqSearch'] });
  rejectMessage.value = '';
});

const { mutate: approve, isPending: approvePending } = useMutation({
  mutationFn: $trpc.song.review.approve.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['song.listReview'] });
  },
  onError: err => useErrorHandler(err),
});

const { mutate: reject, isPending: rejectPending } = useMutation({
  mutationFn: $trpc.song.review.reject.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['song.listReview'] });
  },
  onError: err => useErrorHandler(err),
});
</script>
