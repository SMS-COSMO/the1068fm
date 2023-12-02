<template>
  <div class="flex flex-row gap-5 h-screen p-5 max-w-[1400px] mx-auto">
    <UiCard class="basis-1/3">
      <UiCardHeader class="flex flex-row">
        <UiButton @click="navigateTo('/manage')" variant="outline" size="icon">
          <ChevronLeft class="w-4 h-4" />
        </UiButton>
        <div class="ml-3">
          <UiCardTitle>投稿时间段</UiCardTitle>
          <UiCardDescription>允许在这些时间段内投稿</UiCardDescription>
        </div>
      </UiCardHeader>
      <UiCardContent>
        <TimeAvailability borderless class="mt-[-1rem]" :key="updateKey" />
        <UiScrollArea class="h-[calc(100vh-19rem)]">
          <TransitionGroup name="list" tag="ul">
            <li v-for="time in timeList" :key="time.id">
              <TimeCard :time="time" @click="rightPanelMode = 'modify'; selectedTime = time;"
                :selected="selectedTime === time && rightPanelMode === 'modify'" class="cursor-pointer"
                @edit-success="updateKey += 1;">
              </TimeCard>
            </li>
          </TransitionGroup>
        </UiScrollArea>
        <UiButton @click="rightPanelMode = 'create'" variant="outline" size="icon" class="mt-4 h-20 w-full">
          <Plus class="w-5 h-5" />
        </UiButton>
      </UiCardContent>
    </UiCard>
    <UiCard class="basis-2/3">
      <UiCardHeader>
        <UiCardTitle v-if="rightPanelMode === 'modify'">修改时间段</UiCardTitle>
        <UiCardTitle v-else>创建时间段</UiCardTitle>
      </UiCardHeader>
      <UiCardContent class="px-10">
        <UiScrollArea class="h-[calc(100vh-10rem)]">
          <NewTimeForm v-if="rightPanelMode === 'create'"
            @submit-success="time => { timeList.push(time); updateKey += 1; }" />
          <TimeEditForm v-else-if="rightPanelMode === 'modify'" :time="selectedTime" @submit-success="editSuccess"
            @delete-success="deleteSuccess" />
          <div v-else></div>
        </UiScrollArea>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { Plus, ChevronLeft } from 'lucide-vue-next';
import type { TTime, TTimeList } from '~/types';
const { $api } = useNuxtApp();

definePageMeta({
  pageTransition: {
    name: 'slide-down',
    mode: 'out-in'
  }
});

const updateKey = ref(0);
const timeList = ref<TTimeList>([]);
const selectedTime = ref<TTime>(timeList.value[0]);
const rightPanelMode = ref<'modify' | 'create' | 'nothing'>('nothing');

const editSuccess = (time: TTime) => {
  updateKey.value += 1;
  const i = timeList.value.findIndex(item => item.id === time.id);
  timeList.value[i] = time;
};

const deleteSuccess = (id: string) => {
  updateKey.value += 1;
  const i = timeList.value.findIndex(item => item.id === id);
  timeList.value.splice(i, 1);
};

onMounted(async () => {
  try {
    timeList.value = await $api.time.list.query();
    selectedTime.value = timeList.value[0];
    rightPanelMode.value = 'modify';
  } catch (err) {
    useErrorHandler(err)
  }
});
</script>