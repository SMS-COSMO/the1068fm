<script setup lang="ts">
import { useSongStore } from '~/stores/song';
import type { TSafeSong, TSong } from '~/types';

const props = withDefaults(defineProps<{
  song: TSong | TSafeSong
  compact?: boolean
  sorting?: boolean
  selected?: boolean
  showMine?: boolean
}>(), {
  compact: false,
  editable: false,
  sorting: false,
  selected: false,
  showMine: false,
});

function isMine() {
  const songStore = useSongStore();
  return songStore.isMySong(props.song.id);
}
</script>

<template>
  <UiCard :class="`mb-2 ${selected ? 'bg-slate-100' : ''} transition-all ease-in-out`">
    <UiCardHeader :class="`${compact ? 'p-4' : ''} items-start space-y-0 flex-row`">
      <div v-if="sorting" class="self-center w-4 mr-3 my-[-10px] flex flex-col gap-1">
        <slot name="prefix" />
      </div>
      <div class="space-y-1 w-full">
        <UiCardTitle :class="`${compact ? 'text-lg' : ''} flex flex-row break-all`">
          {{ song?.name }}
          <UiBadge v-if="isMine()" class="rounded-md ml-2 self-center h-6 min-w-[66px]" variant="secondary">
            我投稿的
          </UiBadge>
        </UiCardTitle>
        <UiCardDescription v-if="song?.creator">
          <span class="break-all">
            歌手：{{ song?.creator }}
          </span>
          <UiTooltipProvider v-if="(typeof song.message) === 'string' && 'type' in song && song.type === 'withMsg'">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiBadge class="ml-1 rounded-md">
                  留言
                </UiBadge>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ song?.message }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </UiCardDescription>
      </div>
      <div class="self-center ml-auto">
        <slot name="suffix" />
      </div>
    </UiCardHeader>
  </UiCard>
</template>
