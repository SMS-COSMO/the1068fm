<template>
  <UiCard class="mb-2">
    <UiCardHeader :class="`${compact ? 'p-4' : ''} grid grid-cols-[1fr_110px] items-start gap-4 space-y-0`">
      <div class="space-y-1">
        <UiCardTitle :class="compact ? 'text-lg' : ''">
          {{ song?.name }}
        </UiCardTitle>
        <UiCardDescription v-if="song?.creator">
          by {{ song?.creator }}
          <UiTooltipProvider v-if="song?.type === 'withMsg'">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiBadge  class="ml-1 rounded-md">留言</UiBadge>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ song?.message }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </UiCardDescription>
      </div>
      <div class="self-center ml-auto">
        <slot name="action"></slot>
      </div>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
import type { TSong } from '~/lib/utils';

const props = withDefaults(defineProps<{
  song: TSong;
  compact?: boolean;
}>(), {
  compact: false,
  editable: false
});
</script>