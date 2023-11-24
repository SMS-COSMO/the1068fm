<template>
  <UiCard class="mb-2">
    <UiCardHeader :class="`${compact ? 'p-4' : ''} items-start gap-4 space-y-0 flex-row`">
      <div v-if="sorting" class="self-center w-4 mr-3 my-[-10px] flex flex-col gap-1">
        <slot name="prefix"></slot>
      </div>
      <div class="space-y-1">
        <UiCardTitle :class="compact ? 'text-lg' : ''">
          {{ song?.name }}
        </UiCardTitle>
        <UiCardDescription v-if="song?.creator">
          by {{ song?.creator }}
          <UiTooltipProvider v-if="song?.type === 'withMsg'">
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiBadge class="ml-1 rounded-md">留言</UiBadge>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ song?.message }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </UiCardDescription>
      </div>
      <div class="self-center ml-auto">
        <slot name="suffix"></slot>
      </div>
    </UiCardHeader>
  </UiCard>
</template>

<script setup lang="ts">
import type { TSong } from '~/lib/utils';

const props = withDefaults(defineProps<{
  song: TSong;
  compact?: boolean;
  sorting?: boolean;
}>(), {
  compact: false,
  editable: false,
  sorting: false,
});
</script>