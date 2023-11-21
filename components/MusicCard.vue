<template>
  <UiCard :class="`${compact ? 'mb-3' : 'mb-4'}`">
    <UiCardHeader :class="`${compact ? 'p-4' : ''} grid grid-cols-[1fr_110px] items-start gap-4 space-y-0`">
      <div class="space-y-1">
        <UiCardTitle :class="compact ? 'text-lg' : ''">
          {{ title }}
        </UiCardTitle>
        <UiCardDescription v-if="creator">
          by {{ creator }}
        </UiCardDescription>
      </div>
      <div v-if="editable" class="flex items-center space-x-1 rounded-md bg-secondary">
        <UiButton variant="secondary" class="px-3 shadow-none whitespace-nowrap">
          <span class="icon-[tabler--edit]"></span>
          操作
        </UiButton>
        <UiSeparator orientation="vertical" class="h-[20px]" />
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton variant="secondary" class="px-2 shadow-none">
              <span class="icon-[tabler--chevron-down]"></span>
            </UiButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent align="end" :align-offset="-5" class="w-[200px]">
            <UiDropdownMenuItem>
              <span class="icon-[tabler--plus] mr-1"></span>
              加入今日歌单
            </UiDropdownMenuItem>
            <UiDropdownMenuItem>
              <span class="icon-[tabler--x] mr-1"></span>
              拒绝
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  creator: string;
  compact?: boolean;
  editable?: boolean;
}>(), {
  compact: false,
  editable: false
});
</script>