<script setup lang="ts">
import { ChevronLeft, Plus } from 'lucide-vue-next';
import type { TTime, TTimeList } from '~/types';

const { $api } = useNuxtApp();

definePageMeta({
  pageTransition: {
    name: 'slide-down',
    mode: 'out-in',
  },
});

useHead({
  title: '投稿时间管理 | the1068fm 点歌系统',
  meta: [
    { name: 'description', content: 'the1068fm 点歌系统 Made by COSMO.' },
  ],
});

const updateKey = ref(0);
const timeList = ref<TTimeList>([]);
const selectedTime = ref<TTime>(timeList.value[0]);
const rightPanelMode = ref<'modify' | 'create' | 'nothing'>('nothing');

function editSuccess(time: TTime) {
  updateKey.value += 1;
  const i = timeList.value.findIndex(item => item.id === time.id);
  timeList.value[i] = time;
  selectedTime.value = time;
}

function moveFocus(last: boolean = true) {
  if (timeList.value.length) {
    selectedTime.value = timeList.value[last ? timeList.value.length - 1 : 0];
    rightPanelMode.value = 'modify';
  } else { rightPanelMode.value = 'nothing'; }
}

function deleteSuccess(id: string) {
  updateKey.value += 1;
  const i = timeList.value.findIndex(item => item.id === id);
  timeList.value.splice(i, 1);
  moveFocus();
}

function createSuccess(time: TTime) {
  timeList.value.push(time);
  updateKey.value += 1;
  moveFocus();
}

onMounted(async () => {
  try {
    await $api.user.tokenValidity.query();
  } catch (err) {
    navigateTo('/manage/login');
  }
  try {
    timeList.value = await $api.time.list.query();
    moveFocus(false);
  } catch (err) {
    useErrorHandler(err);
  }
});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5 lg:h-screen p-4 lg:p-5 max-w-[1400px] mx-auto">
    <UiCard class="basis-1/3">
      <UiCardHeader class="flex flex-row px-4 pt-5 lg:px-6 lg:pt-6">
        <UiButton variant="outline" size="icon" @click="navigateTo('/manage')">
          <ChevronLeft class="w-4 h-4" />
        </UiButton>
        <div class="ml-3">
          <UiCardTitle>投稿时间段</UiCardTitle>
          <UiCardDescription>允许在这些时间段内投稿</UiCardDescription>
        </div>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-6">
        <TimeAvailability :key="updateKey" borderless class="mt-[-1rem]" />
        <UiScrollArea class="lg:h-[calc(100vh-19rem)]">
          <TransitionGroup name="list" tag="ul">
            <li v-for="time in timeList" :key="time.id">
              <TimeCard
                :key="updateKey" :time="time" :selected="selectedTime === time && rightPanelMode === 'modify'"
                class="cursor-pointer" @click="rightPanelMode = 'modify'; selectedTime = time;"
                @edit-success="updateKey += 1;"
              />
            </li>
          </TransitionGroup>
        </UiScrollArea>
        <UiButton variant="outline" size="icon" class="mt-2 lg:mt-4 h-10 lg:h-20 w-full" @click="rightPanelMode = 'create'">
          <Plus class="w-5 h-5" />
        </UiButton>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-2/3">
      <UiCardHeader class="px-4 pt-5 lg:px-6 lg:pt-6">
        <UiCardTitle v-if="rightPanelMode === 'modify'">
          修改时间段
        </UiCardTitle>
        <UiCardTitle v-else>
          创建时间段
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent class="px-4 lg:px-10">
        <UiScrollArea class="lg:h-[calc(100vh-10rem)]">
          <TimeCreateForm
            v-if="rightPanelMode === 'create'"
            @submit-success="createSuccess"
          />
          <TimeEditForm
            v-else-if="rightPanelMode === 'modify'" :time="selectedTime" @submit-success="editSuccess"
            @delete-success="deleteSuccess"
          />
          <div v-else />
        </UiScrollArea>
      </UiCardContent>
    </UiCard>
  </div>
</template>
