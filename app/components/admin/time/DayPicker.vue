<template>
  <div class="flex flex-row gap-2">
    <Button type="button" variant="outline" size="icon" @click="handleChange(value.setDate(value.getDate() - 1))">
      <Icon name="lucide:minus" />
    </Button>
    <div class="self-center text-2xl font-bold">
      {{ `${dayString[value.getDay()]}` }}
    </div>
    <Button type="button" variant="outline" size="icon" @click="handleChange(value.setDate(value.getDate() + 1))">
      <Icon name="lucide:plus" />
    </Button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: Date;
  handleChange: any;
}>();

const dayString = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
</script>
