<template>
  <CalendarGridBody v-bind="props">
    <slot />
  </CalendarGridBody>
</template>

<script lang="ts" setup>
import { CalendarGridBody, type CalendarGridBodyProps } from 'radix-vue';

const props = defineProps<CalendarGridBodyProps>();
</script>
