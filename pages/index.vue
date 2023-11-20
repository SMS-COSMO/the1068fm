<template>
  <div class="mx-9">
    <div class="font-bold text-4xl mb-10 mt-16">
      点歌
    </div>

    <div class="flex flex-row gap-5">
      <UiCard class="h-30 basis-1/2 shadow">
        <UiCardHeader class="pb-2 text-lg">
          目前歌曲队列
        </UiCardHeader>
        <UiCardContent>
          <span class="font-bold text-3xl">10</span>
        </UiCardContent>
      </UiCard>
      <UiButton class="h-30 basis-1/2 shadow text-2xl">
        <span class="icon-[tabler--music] mr-1"></span>
        歌曲投稿
      </UiButton>
    </div>

    <UiCard class="mt-6 shadow">
      <UiCardHeader>
        <UiInput placeholder="搜索歌单" class="text-md" />
      </UiCardHeader>
      <UiCardContent>
        <MusicCard title="Compact music card" creator="ahehrbakbrjk" compact />
        <MusicCard title="Song B" creator="ahehrbakbrjk" />
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
</script>
