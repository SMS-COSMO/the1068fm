<template>
  <div>
    <ClientOnly>
      <UiCard :class="`${borderless ? 'border-none shadow-none' : ''}`">
        <UiCardContent class="flex flex-row p-4">
          <div
            :class="`h-3.5 w-3.5 ${stateColor['bg'][state]} rounded-full self-center ${stateColor['border'][state]} border-2`">
          </div>
          <span class="ml-2 self-center">目前投稿状态</span>
          <span :class="`self-center font-bold ml-2 ${stateColor['text'][state]}`">{{ stateText[state] }}</span>
          <UiButton v-if="showButton" @click="navigateTo('/manage/time')" variant="secondary" class="ml-auto h-8">
            设置开放时段
          </UiButton>
        </UiCardContent>
      </UiCard>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();
const state = ref<'unknown' | 'can' | 'cannot'>('unknown');

withDefaults(defineProps<{
  borderless?: boolean;
  showButton?: boolean;
}>(), {
  borderless: false,
  showButton: false,
});

const stateText = {
  'unknown': '未知',
  'can': '开放',
  'cannot': '关闭',
};

const stateColor = {
  'bg': {
    'unknown': 'bg-slate-300',
    'can': 'bg-green-300',
    'cannot': 'bg-red-300',
  },
  'border': {
    'unknown': 'border-slate-500',
    'can': 'border-green-500',
    'cannot': 'border-red-500',
  },
  'text': {
    'unknown': 'text-slate-400',
    'can': 'text-green-400',
    'cannot': 'text-red-400',
  },
}

onMounted(async () => {
  state.value = await $api.time.currently.query() ? 'can' : 'cannot';
});
</script>