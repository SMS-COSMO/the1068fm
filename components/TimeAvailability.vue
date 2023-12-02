<template>
  <div>
    <UiCard
      :class="`shadow p-0 pt-1 pb-2	${stateColor['from'][state]} from-[-10%] ${stateColor['via'][state]} via-30% to-white to-80%`"
      style="background: linear-gradient(310deg, var(--tw-gradient-stops))" v-if="isCard">
      <UiCardHeader :class="`pt-1 pb-0 text-3xl font-bold ${stateColor['text'][state]}`">
        {{ stateText[state] }}
      </UiCardHeader>
      <UiCardContent class="pt-0 pb-0">
        <span class="text-md">目前投稿状态</span>
      </UiCardContent>
    </UiCard>
    <UiCard :class="`${borderless ? 'border-none shadow-none' : ''}`" v-else>
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
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();
const state = ref<'unknown' | 'can' | 'cannot'>('unknown');

withDefaults(defineProps<{
  borderless?: boolean;
  showButton?: boolean;
  isCard?: boolean;
}>(), {
  borderless: false,
  showButton: false,
  isCard: false,
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
    'unknown': 'text-slate-500',
    'can': 'text-green-500',
    'cannot': 'text-red-500',
  },
  'from': {
    'unknown': 'from-slate-300',
    'can': 'from-green-300',
    'cannot': 'from-red-300',
  },
  'via': {
    'unknown': 'via-slate-100',
    'can': 'via-green-100',
    'cannot': 'via-red-100',
  },
}

onMounted(async () => {
  state.value = await $api.time.currently.query() ? 'can' : 'cannot';
});
</script>