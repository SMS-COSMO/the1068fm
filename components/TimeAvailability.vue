<script setup lang="ts">
type TState = 'unknown' | 'can' | 'cannot';

const props = withDefaults(defineProps<{
  borderless?: boolean;
  showButton?: boolean;
  isCard?: boolean;
  status?: TState;
}>(), {
  borderless: false,
  showButton: false,
  isCard: false,
  status: 'unknown',
});

const { $api } = useNuxtApp();
const state = ref<TState>('unknown');

const stateText = {
  unknown: '未知',
  can: '开放',
  cannot: '关闭',
};

const stateColor = {
  bg: {
    unknown: 'bg-slate-300',
    can: 'bg-green-300',
    cannot: 'bg-red-300',
  },
  border: {
    unknown: 'border-slate-500',
    can: 'border-green-500',
    cannot: 'border-red-500',
  },
  text: {
    unknown: 'text-slate-500',
    can: 'text-green-500',
    cannot: 'text-red-500',
  },
  from: {
    unknown: 'from-slate-300',
    can: 'from-green-300',
    cannot: 'from-red-300',
  },
  via: {
    unknown: 'via-slate-100',
    can: 'via-green-100',
    cannot: 'via-red-100',
  },
};

onMounted(async () => {
  if (!props.isCard)
    state.value = await $api.time.currently.query() ? 'can' : 'cannot';
});
</script>

<template>
  <div>
    <UiCard
      v-if="isCard"
      :class="`flex flex-col justify-center items-start shadow p-0 pt-1 pb-2 ${stateColor.from[status]} from-[-10%] ${stateColor.via[status]} via-30% to-white to-80%`" style="background: linear-gradient(310deg, var(--tw-gradient-stops))"
    >
      <UiCardHeader :class="`pt-1 pb-0 text-3xl font-bold ${stateColor.text[status]}`">
        {{ stateText[status] }}
      </UiCardHeader>
      <UiCardContent class="pt-0 pb-0">
        <span class="text-md">目前投稿状态</span>
      </UiCardContent>
    </UiCard>
    <UiCard v-else :class="`${borderless ? 'border-none shadow-none' : ''}`">
      <UiCardContent class="flex flex-row p-4">
        <div
          :class="`h-3.5 w-3.5 ${stateColor.bg[state]} rounded-full self-center ${stateColor.border[state]} border-2`"
        />
        <span class="ml-2 self-center">目前投稿状态</span>
        <span :class="`self-center font-bold ml-2 ${stateColor.text[state]}`">{{ stateText[state] }}</span>
        <UiButton v-if="showButton" variant="secondary" class="ml-auto h-8" @click="navigateTo('/manage/time')">
          设置开放时段
        </UiButton>
      </UiCardContent>
    </UiCard>
  </div>
</template>
