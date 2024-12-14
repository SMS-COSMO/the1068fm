<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="xs" class="font-mono">
        {{ songs.length }}
      </Button>
    </SheetTrigger>
    <SheetContent class="overflow-scroll">
      <SheetHeader>
        <SheetTitle class="flex gap-2">
          <span>点歌记录</span>
          <Badge variant="secondary">
            {{ songs.length }} 首
          </Badge>
        </SheetTitle>
        <SheetDescription />
      </SheetHeader>
      <div class="flex flex-col gap-3">
        <SongCard v-for="song in songs" :key="song.id" :song />
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

defineProps<{
  songs: RouterOutput['user']['list'][0]['songs'];
}>();
</script>
