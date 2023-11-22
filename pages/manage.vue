<template>
  <div class="flex flex-row gap-5 h-screen p-5">
    <UiCard class="basis-1/3 pt-4 relative">
      <UiCardHeader>
        <UiCardTitle>
          Calendar
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <UiCalendar class="rounded-lg border"></UiCalendar>
      </UiCardContent>
      <UiPopover v-model:open="open">
        <UiPopoverTrigger as-child>
          <UiButton variant="outline" role="combobox" :aria-expanded="open"
            class="justify-between absolute bottom-5 left-5">
            账号
            <span class="icon-[radix-icons--caret-sort] text-lg"></span>
          </UiButton>
        </UiPopoverTrigger>
        <UiPopoverContent class="w-[200px] p-0">
          <UiCommand>
            <UiCommandGroup>
              <UiCommandItem value="logout">
                <span class="icon-[tabler--logout] mr-1"></span>登出
              </UiCommandItem>
            </UiCommandGroup>
          </UiCommand>
        </UiPopoverContent>
      </UiPopover>
    </UiCard>
    <UiCard class="basis-1/3 relative pt-4">
      <UiCardHeader>
        <UiCardTitle>
          本周排歌表
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <MusicCard title="dsd" creator="aa" editable></MusicCard>
      </UiCardContent>
      <UiButton class="absolute right-5 bottom-5">
        保存修改
      </UiButton>
    </UiCard>
    <UiCard class="basis-1/3 relative pt-4">
      <UiCardHeader>
        <UiCardTitle>
          总歌单
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <UiTabs>
          <UiTabsList default-value="unset" class="grid grid-cols-3">
            <UiTabsTrigger value="unset">
              待审核
            </UiTabsTrigger>
            <UiTabsTrigger value="rejected">
              已拒绝
            </UiTabsTrigger>
            <UiTabsTrigger value="used">
              已使用
            </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="unset">
            <MusicCard title="dsd" creator="aa" editable></MusicCard>
            <UiButton variant="destructive" class="absolute right-5 bottom-5">
              全部拒绝
            </UiButton>
          </UiTabsContent>
          <UiTabsContent value="rejected">
            Rejected
          </UiTabsContent>
          <UiTabsContent value="used">
            Used
          </UiTabsContent>
        </UiTabs>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
const open = ref(false);
</script>