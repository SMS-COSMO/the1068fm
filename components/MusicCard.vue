<template>
  <UiCard :class="`mb-2 ${selected ? 'bg-slate-100' : ''} transition-all ease-in-out`">
    <UiCardHeader :class="`${compact ? 'p-4' : ''} items-start gap-4 space-y-0 flex-row`">
      <div v-if="sorting" class="self-center w-4 mr-3 my-[-10px] flex flex-col gap-1">
        <slot name="prefix"></slot>
      </div>
      <div class="space-y-1">
        <UiCardTitle :class="`${compact ? 'text-lg' : ''} flex flex-row`">
          {{ song?.name }}
          <UiBadge class="rounded-md ml-2" v-if="isMine()" variant="secondary">我申请的</UiBadge>
        </UiCardTitle>
        <UiCardDescription v-if="song?.creator">
          by {{ song?.creator }}
          <UiTooltipProvider v-if="(typeof song.message) === 'string' && 'type' in song && song.type === 'withMsg'">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiBadge class="ml-1 rounded-md">留言</UiBadge>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ song?.message }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </UiCardDescription>
      </div>
      <div class="self-center ml-auto">
        <slot name="suffix"></slot>
      </div>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
import { useSongStore } from '~/stores/song';
import type { TSafeSong, TSong } from '~/types';

const props = withDefaults(defineProps<{
  song: TSong | TSafeSong;
  compact?: boolean;
  sorting?: boolean;
  selected?: boolean;
  showMine?: boolean;
}>(), {
  compact: false,
  editable: false,
  sorting: false,
  selected: false,
  showMine: false,
});

const isMine = () => {
  const songStore = useSongStore();
  return songStore.isMySong(props.song.id);
};
</script>