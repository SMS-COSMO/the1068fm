<template>
  <Card v-if="type === 'public'">
    <CardHeader class="flex flex-row">
      <div>
        <CardTitle>
          {{ song.name }}
        </CardTitle>
        <CardDescription>
          {{ song.creator }}
        </CardDescription>
      </div>
      <div class="flex-grow" />
      <SongState :song />
      <div v-if="song.message" class="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Badge variant="outline" size="sm">
                留言
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {{ song.message }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
  </Card>
  <div
    v-else-if="type === 'review'"
    class="h-auto p-4 w-full border rounded-lg shadow-sm hover:bg-muted transition-colors cursor-pointer"
    :class="{ 'bg-muted': selected }"
  >
    <CardTitle>
      {{ song.name }}
    </CardTitle>
    <CardDescription>
      {{ song.creator }}
    </CardDescription>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

const { type = 'public', selected = false } = defineProps<{
  type?: 'public' | 'review';
  selected?: boolean;
  song: Partial<RouterOutput['song']['list'][0]>;
}>();
</script>
