<template>
  <CalendarHeading
    v-slot="slotProps: HeadingSlotProps"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <slot :heading-value="slotProps.headingValue">
      {{ slotProps.headingValue }}
    </slot>
  </CalendarHeading>
</template>

<script lang="ts" setup>
import type { CalendarHeadingProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { CalendarHeading, useForwardProps } from 'radix-vue';
import { computed } from 'vue';

const props = defineProps<CalendarHeadingProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

interface HeadingSlotProps {
  headingValue: string;
}
</script>
