<template>
  <Button
    v-if="isCard"
    variant="outline"
    class="block size-full items-center gap-2"
    :class="`${stateColor.from[state]} from-[-10%] ${stateColor.via[state]} via-30% to-white to-80%`"
    style="background: linear-gradient(310deg, var(--tw-gradient-stops))"
  >
    <div class="text-xs text-zinc-950">
      目前投稿状态
    </div>
    <div class="text-2xl font-bold" :class="stateColor.text[state]">
      {{ stateText[state] }}
    </div>
  </Button>
  <template v-else>
    <div class="flex flex-row items-center p-2">
      <div
        class="size-3.5 rounded-full border-2" :class="[stateColor.bg[state], stateColor.border[state]]"
      />
      <span class="ml-2 text-sm">目前投稿状态</span>
      <span class="ml-2 text-sm font-bold" :class="stateColor.text[state]">{{ stateText[state] }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
type TState = 'unknown' | 'can' | 'cannot';

const {
  isCard = false,
} = defineProps<{
  showButton?: boolean;
  isCard?: boolean;
}>();

const { $trpc } = useNuxtApp();
const { data, suspense } = useQuery({
  queryFn: () => $trpc.time.currently.query(),
  queryKey: ['time.currently'],
});
await suspense();

const state = computed<TState>(() => data.value ? 'can' : 'cannot');

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
</script>
