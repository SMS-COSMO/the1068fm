<template>
  <div>
    <ClientOnly>
      <UiCard :class="`${borderless ? 'border-none shadow-none' : ''}`">
        <UiCardContent class="flex flex-row p-4">
          <div :class="`h-3.5 w-3.5 bg-${state}-300 rounded-full self-center border-${state}-500 border-2`">
          </div>
          <span class="ml-2 self-center">目前投稿状态</span>
          <span :class="`self-center font-bold ml-2 text-${state}-400`">{{ stateText[state] }}</span>
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
const state = ref<'slate' | 'green' | 'red'>('slate');

withDefaults(defineProps<{
  borderless?: boolean;
  showButton?: boolean;
}>(), {
  borderless: false,
  showButton: false,
});

const stateText = {
  'slate': '未知',
  'green': '开放',
  'red': '关闭',
};

onMounted(async () => {
  state.value = await $api.time.currently.query() ? 'green' : 'red';
});
</script>