<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
</script>

<template>
  <div class="flex mx-auto justify-center items-center py-2">
    <Loader2 class="w-4 h-4 mr-2 animate-spin" />
    <span class="text-md">数据加载中</span>
  </div>
</template>
