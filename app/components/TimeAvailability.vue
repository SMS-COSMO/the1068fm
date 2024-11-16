<template>
  <div>
    <Card
      v-if="isCard"
      :class="`flex flex-col justify-center items-start shadow p-0 pt-1 pb-2 ${stateColor.from[status]} from-[-10%] ${stateColor.via[status]} via-30% to-white to-80%`" style="background: linear-gradient(310deg, var(--tw-gradient-stops))"
    >
      <CardHeader :class="`pt-1 pb-0 text-3xl font-bold ${stateColor.text[status]}`">
        {{ stateText[status] }}
      </CardHeader>
      <CardContent class="pt-0 pb-0">
        <span class="text-md">目前投稿状态</span>
      </CardContent>
    </Card>
    <div v-else>
      <CardContent class="flex flex-row p-2 items-center">
        <div
          class="h-3.5 w-3.5 rounded-full border-2" :class="[stateColor.bg[state], stateColor.border[state]]"
        />
        <span class="ml-2 text-sm">目前投稿状态</span>
        <span class="font-bold ml-2 text-sm" :class="stateColor.text[state]">{{ stateText[state] }}</span>
      </CardContent>
    </div>
  </div>
</template>

<script setup lang="ts">
type TState = 'unknown' | 'can' | 'cannot';

const {
  isCard = false,
  status = 'unknown',
} = defineProps<{
  showButton?: boolean;
  isCard?: boolean;
  status?: TState;
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
