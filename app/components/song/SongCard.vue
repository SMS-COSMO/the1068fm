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
        <div class="h-6">
          <SongState :song />
        </div>
      </div>
      <p v-if="song.message" class="text-xs text-muted-foreground">
        留言: {{ song.message }}
      </p>
    </CardHeader>
  </Card>
  <div
    v-else-if="type === 'review'"
    class="h-auto p-4 w-full border rounded-lg shadow-sm hover:bg-muted transition-colors cursor-pointer"
    :class="{ 'bg-muted': selected }"
  >
    <CardTitle>
      {{ song.name }}
    </CardTitle>
    <CardDescription>
      {{ song.creator }}
    </CardDescription>
  </div>

  <ClientOnly>
    <UseTemplate>
      <ul class="grid gap-3">
        <li class="flex justify-between">
          <span class="text-muted-foreground text-sm min-w-20">审核状态</span>
          <SongState :song hide-reason />
        </li>
        <li v-if="song.rejectMessage" class="flex justify-between">
          <span class="text-muted-foreground text-sm min-w-20">拒绝理由</span>
          <span>{{ song.rejectMessage }}</span>
        </li>
        <li v-if="song.arrangementDate" class="flex justify-between">
          <span class="text-muted-foreground text-sm min-w-20">播放时间</span>
          <span class="font-mono">{{ song.arrangementDate }}</span>
        </li>
        <li v-if="song.message" class="flex justify-between">
          <span class="text-muted-foreground text-sm min-w-20">留言</span>
          <span>{{ song.message }}</span>
        </li>
        <li v-if="song.createdAt" class="flex justify-between">
          <span class="text-muted-foreground text-sm min-w-20">投稿时间</span>
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
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const { song, type = 'public', selected = false } = defineProps<{
  type?: 'public' | 'review';
  selected?: boolean;
  song: Partial<RouterOutput['song']['listMine'][0]>;
}>();

const isOpen = ref(false);

const isDesktop = useMediaQuery('(min-width: 768px)');
const [UseTemplate, SongDrawer] = createReusableTemplate();
</script>
