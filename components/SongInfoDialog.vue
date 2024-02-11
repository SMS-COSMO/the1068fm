<script setup lang="ts">
const { isOpen, toggleOpen, info } = defineProps<{ isOpen: boolean; toggleOpen: (value?: boolean | undefined) => boolean; info: string }>();
</script>

<template>
  <UiDialog :open="isOpen" @update:open="toggleOpen">
    <UiDialogContent class="w-[92vw] rounded-md">
      <UiDialogHeader>
        <UiDialogTitle class="text-xl font-bold text-start">
          歌单内容
        </UiDialogTitle>
        <UiDialogDescription class="text-start">
          写入剪贴板失败，请手动复制
        </UiDialogDescription>
      </UiDialogHeader>
      <p class="prose whitespace-pre-line">
        {{ info }}
      </p>
      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton type="button" variant="secondary" class="ml-auto px-6">
            好的
          </UiButton>
        </UiDialogClose>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
