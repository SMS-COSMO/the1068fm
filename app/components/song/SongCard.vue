<template>
  <Card v-if="type === 'public'" class="hover:cursor-pointer" @click="isOpen = true">
    <CardHeader>
      <div class="flex flex-row">
        <div>
          <CardTitle>
            {{ song.name }}
          </CardTitle>
          <CardDescription>
            {{ song.creator }}
          </CardDescription>
        </div>
        <div class="flex-grow" />
        <span v-if="song.createdAt" class="text-xs text-muted-foreground">
          {{ useTimeAgo(song.createdAt) }}
        </span>
      </div>
      <p v-if="song.message" class="text-xs text-muted-foreground">
        留言: {{ song.message }}
      </p>
      <SongState v-if="!isArrangement" :song />
    </CardHeader>

    <ClientOnly>
      <UseTemplate>
        <ul class="grid gap-3">
          <li class="flex justify-between">
            <span class="min-w-20 text-sm text-muted-foreground">审核状态</span>
            <SongState :song hide-reason />
          </li>
          <li v-if="song.rejectMessage" class="flex justify-between">
            <span class="min-w-20 text-sm text-muted-foreground">拒绝理由</span>
            <span>{{ song.rejectMessage }}</span>
          </li>
          <li v-if="song.arrangementDate" class="flex justify-between">
            <span class="min-w-20 text-sm text-muted-foreground">播放时间</span>
            <span class="font-mono">{{ song.arrangementDate }}</span>
          </li>
          <li v-if="song.message" class="flex justify-between">
            <span class="min-w-20 text-sm text-muted-foreground">留言</span>
            <span>{{ song.message }}</span>
          </li>
          <li v-if="song.createdAt" class="flex justify-between">
            <span class="min-w-20 text-sm text-muted-foreground">投稿时间</span>
            <span class="font-mono">{{ song.createdAt?.toLocaleString('zh-CN') }}</span>
          </li>
        </ul>
      </UseTemplate>

      <Dialog v-if="isDesktop" v-model:open="isOpen">
        <DialogTrigger as-child>
          <slot />
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{{ song.name }}</DialogTitle>
            <DialogDescription>
              {{ song.creator }}
            </DialogDescription>
          </DialogHeader>
          <SongDrawer />
        </DialogContent>
      </Dialog>

      <Drawer v-else v-model:open="isOpen">
        <DrawerTrigger as-child>
          <slot />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader class="text-left">
            <DrawerTitle>{{ song.name }}</DrawerTitle>
            <DrawerDescription>
              {{ song.creator }}
            </DrawerDescription>
          </DrawerHeader>
          <SongDrawer class="px-4" />
          <DrawerFooter class="pt-2" />
        </DrawerContent>
      </Drawer>
    </ClientOnly>
  </Card>
  <div
    v-else-if="type === 'review'"
    class="h-auto w-full cursor-pointer rounded-lg border p-4 shadow-sm transition-colors hover:bg-muted"
    :class="{ 'bg-muted': selected }"
  >
    <CardTitle>
      {{ song.name }}
    </CardTitle>
    <CardDescription>
      {{ song.creator }}
    </CardDescription>
  </div>
  <Card
    v-else-if="type === 'songs'"
  >
    <CardHeader>
      <div class="flex flex-row">
        <div>
          <CardTitle>
            {{ song.name }}
          </CardTitle>
          <CardDescription>
            {{ song.creator }}
          </CardDescription>
        </div>
        <div class="flex-grow" />
        <span v-if="song.createdAt" class="text-xs text-muted-foreground">
          {{ useTimeAgo(song.createdAt) }}
        </span>
      </div>
      <p v-if="song.message" class="text-xs text-muted-foreground">
        留言: {{ song.message }}
      </p>

      <div v-if="song.state !== 'used' && song.state !== 'dropped' && song.state !== 'ghost'" class="flex gap-1">
        <Button
          v-if="song.state !== 'approved' && song.id"
          variant="outline"
          :disable="approvePending"
          size="xs"
          @click="approve({ id: song.id })"
        >
          <Icon v-if="approvePending" name="lucide:loader-circle" class="mr-2 animate-spin" />
          <Icon name="lucide:check" />
        </Button>
        <template v-if="song.state !== 'rejected' && song.id">
          <Button
            variant="outline"
            :disable="rejectPending"
            size="xs"
            @click="reject({ id: song.id, rejectMessage: rejectMessage.trim() })"
          >
            <Icon v-if="rejectPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
            <Icon name="lucide:x" />
          </Button>
          <Input v-model="rejectMessage" placeholder="拒绝理由" class="h-7 rounded-sm text-xs" />
        </template>
      </div>
    </CardHeader>
  </Card>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const {
  song,
  type = 'public',
  selected = false,
  isArrangement = false,
} = defineProps<{
  type?: 'public' | 'review' | 'songs';
  selected?: boolean;
  song: Partial<RouterOutput['song']['listMine'][0]>;
  isArrangement?: boolean;
}>();

const isOpen = ref(false);

const isDesktop = useMediaQuery('(min-width: 768px)');
const [UseTemplate, SongDrawer] = createReusableTemplate();

const { $trpc } = useNuxtApp();

const queryClient = useQueryClient();
const { mutate: approve, isPending: approvePending } = useMutation({
  mutationFn: $trpc.song.review.approve.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['song.list'] });
  },
  onError: err => useErrorHandler(err),
});

const { mutate: reject, isPending: rejectPending } = useMutation({
  mutationFn: $trpc.song.review.reject.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['song.list'] });
  },
  onError: err => useErrorHandler(err),
});

const rejectMessage = ref('');
</script>
