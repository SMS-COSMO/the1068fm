<template>
  <div class="flex flex-row gap-2">
    <UiButton @click="handleChange(value.setDate(value.getDate() - 1))" type="button" variant="outline" size="icon">
      <Minus class="w-4 h-4" />
    </UiButton>
    <div class="text-2xl font-bold self-center">
      {{ `${dayString[value.getDay()]}` }}
    </div>
    <UiButton @click="handleChange(value.setDate(value.getDate() + 1))" type="button" variant="outline" size="icon">
      <Plus class="w-4 h-4" />
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
defineProps<{
  value: Date;
  handleChange: Function;
}>();

const dayString = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
</script>