<script setup lang="ts">
withDefaults(defineProps<{
  name: string;
  isDestructive?: boolean;
  action: () => void;
}>(), {
  isDestructive: false,
});
const open = ref(false);
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton variant="outline" @click="open = true">
        全部{{ name }}
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-60 mr-2 mb-2 p-2">
      <UiCard class="border-0 shadow-transparent">
        <UiCardHeader class="p-2">
          <UiCardTitle class="text-xl">
            确定要全部{{ name }}吗？
          </UiCardTitle>
          <UiCardDescription>
            此操作不可撤销
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="p-2">
          <div class="ml-auto">
            <UiButton :variant="isDestructive ? 'destructive' : 'default'" @click="action(); open = false">
              是
            </UiButton>
            <UiButton variant="outline" class="ml-2" @click="open = false">
              取消
            </UiButton>
          </div>
        </UiCardContent>
      </UiCard>
    </UiPopoverContent>
  </UiPopover>
</template>
