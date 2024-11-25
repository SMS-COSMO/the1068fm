<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ song.name }}
      </CardTitle>
      <CardDescription>
        {{ song.creator }}
      </CardDescription>
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
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';

defineProps<{
  song: Partial<RouterOutput['song']['list'][0]>;
}>();
</script>
