<template>
  <ClientOnly>
    <UiCard class="mb-4">
      <UiCardHeader class="items-start gap-4 space-y-0 flex-row">
        <div class="w-18 mr-3 flex flex-col gap-1">
          <UiAvatar class="rounded-sm h-20 w-20">
            <UiAvatarImage :src="song.pic" :alt="song.title" />
          </UiAvatar>
        </div>
        <div class="space-y-1 w-full">
          <UiCardTitle>
            {{ song.title }}
            <a :href="song.link" class="icon-[tabler--link] text-lg cursor-pointer float-right"></a>
          </UiCardTitle>
          <UiCardDescription>
            {{ song.author }}
            <audio ref="audio"></audio>
            <div class="flex align-middle">
              <UiButton variant="ghost" @click="playing = !playing" size="icon" class="h-8 ml-[-8px] mr-1 text-slate-950">
                <span v-if="!playing" class="icon-[tabler--player-play-filled] text-xl"></span>
                <span v-else class="icon-[tabler--player-pause-filled] text-xl"></span>
              </UiButton>
              <span class="self-center mr-3">
                {{ getTime(currentTime) }}
              </span>
              <!-- use Infinity to fix initial load flash :D -->
              <UiSlider v-model="sliderTime" :default-value="[0]" :max="duration === 0 ? Infinity : duration"
                :step="duration / 1000" />
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

<script setup lang="ts">
import { useMediaControls } from '@vueuse/core';

const props = defineProps<{
  song: any;
}>();

const audio = ref();
const sliderTime = computed({
  get: () => [currentTime.value],
  set: (val) => {
    currentTime.value = val[0];
  }
});

const { playing, currentTime, duration, volume } = useMediaControls(audio, {
  src: props.song.url,
});

const getTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
};

onMounted(() => {
  volume.value = 0.5;
  currentTime.value = 0;
});
</script>