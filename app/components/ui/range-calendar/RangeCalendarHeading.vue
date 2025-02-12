<template>
  <RangeCalendarHeading
    v-slot="slotProps: RangeHeadingSlotProps"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <slot :heading-value="slotProps.headingValue">
      {{ slotProps.headingValue }}
    </slot>
  </RangeCalendarHeading>
</template>

<script lang="ts" setup>
import type { RangeCalendarHeadingProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { RangeCalendarHeading, useForwardProps } from 'radix-vue';
import { computed } from 'vue';

const props = defineProps<RangeCalendarHeadingProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

interface RangeHeadingSlotProps {
  headingValue: string;
}
</script>
