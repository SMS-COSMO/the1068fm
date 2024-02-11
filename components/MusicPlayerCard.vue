<script setup lang="ts">
import { useMediaControls } from '@vueuse/core';

const props = withDefaults(defineProps<{
  song: any;
  compact?: boolean;
}>(), {
  compact: false,
});

const audio = ref();
const { playing, currentTime, duration, volume } = useMediaControls(audio, {
  src: props.song.url,
});
const sliderTime = computed({
  get: () => [currentTime.value],
  set: (val) => {
    currentTime.value = val[0];
  },
});

function getTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const isError = ref(false);
const { start } = useTimeoutFn(() => {
  isError.value = duration.value === 0;
}, 5000);

onMounted(() => {
  volume.value = 0.5;
  currentTime.value = 0;
  start();
});
</script>

<template>
  <ClientOnly>
    <UiCard class="mb-2">
      <UiCardHeader class="items-start lg:gap-4 space-y-0 flex-row py-4 lg:py-6">
        <div class="w-18 lg:mr-3 flex flex-col gap-1">
          <UiAvatar v-if="!compact" class="rounded-sm h-20 w-20">
            <UiAvatarImage :src="song.pic" :alt="song.title" />
            <UiAvatarFallback>
              <span class="icon-[tabler--help-square] text-3xl text-slate-400" />
            </UiAvatarFallback>
          </UiAvatar>
        </div>
        <div class="space-y-1 w-full">
          <UiCardTitle>
            <span :class="`${compact ? 'text-lg' : ''}`">
              {{ song.title }}
            </span>
            <div class="float-right">
              <UiTooltipProvider v-if="isError">
                <UiTooltip>
                  <UiTooltipTrigger as-child>
                    <span class="icon-[tabler--alert-triangle-filled] text-base lg:text-lg text-yellow-500 self-center" />
                  </UiTooltipTrigger>
                  <UiTooltipContent>
                    <p>无法加载歌曲</p>
                  </UiTooltipContent>
                </UiTooltip>
              </UiTooltipProvider>
              <UiTooltipProvider>
                <UiTooltip>
                  <UiTooltipTrigger as-child>
                    <a :href="song.link" class="icon-[tabler--link] text-base lg:text-lg cursor-pointer ml-2" />
                  </UiTooltipTrigger>
                  <UiTooltipContent>
                    <p>跳转到原链接</p>
                  </UiTooltipContent>
                </UiTooltip>
              </UiTooltipProvider>
            </div>
          </UiCardTitle>
          <UiCardDescription>
            {{ song.author }}
            <audio ref="audio" />
            <div class="flex align-middle">
              <UiButton variant="ghost" size="icon" class="h-8 ml-[-8px] mr-1 text-slate-950" @click="playing = !playing">
                <span v-if="!playing" class="icon-[tabler--player-play-filled] text-xl" />
                <span v-else class="icon-[tabler--player-pause-filled] text-xl" />
              </UiButton>
              <span class="self-center mr-3">
                {{ getTime(currentTime) }}
              </span>
              <!-- use Infinity to fix initial load flash :D -->
              <UiSlider
                v-model="sliderTime" :default-value="[0]" :max="duration === 0 ? Infinity : duration"
                :step="duration / 1000"
              />
              <span class="self-center ml-3">
                {{ getTime(duration) }}
              </span>
            </div>
          </UiCardDescription>
        </div>
      </UiCardHeader>
    </UiCard>
  </ClientOnly>
</template>
