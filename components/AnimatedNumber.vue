<template>
  {{ displayNumber }}
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  value?: number;
  speed?: number;
}>(), {
  value: 0,
  speed: 10,
});

const displayNumber = ref(props.value);
let interval: any = null;

watch(
  () => props.value,
  (newVal) => {
    clearInterval(interval);

    if (newVal === displayNumber.value)
      return;

    interval = setInterval(() => {
      if (Math.floor(displayNumber.value) !== Math.floor(newVal)) {
        let change = (newVal - displayNumber.value) / props.speed;
        change = change >= 0 ? Math.ceil(change) : Math.floor(change);
        displayNumber.value = displayNumber.value + change;
      } else {
        displayNumber.value = newVal;
        clearInterval(interval);
      }
    }, 20);
  }
);
</script>
