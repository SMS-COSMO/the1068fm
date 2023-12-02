<template>
  <form @submit="onSubmit" class="grid grid-cols-1 gap-4">
    <UiFormField v-slot="{ componentField }" name="name">
      <UiFormItem>
        <UiFormLabel>名称</UiFormLabel>
        <UiFormControl>
          <UiInput type="text" v-bind="componentField" />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>

    <UiFormField v-slot="{ value, handleChange }" name="repeats">
      <UiFormItem>
        <UiFormLabel>是否每周重复</UiFormLabel>
        <UiFormControl>
          <UiSwitch :checked="value" @update:checked="handleChange" />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>

    <div class="grid grid-cols-2 gap-5" v-show="!values.repeats">
      <UiFormField v-slot="{ handleChange, value }" name="startAt">
        <UiFormItem>
          <UiFormLabel>开始时间</UiFormLabel>
          <UiFormControl>
            <DatePicker :model-value="value" @update:model-value="handleChange" mode="dateTime" color="gray" locale="zh"
              trim-weeks is-required is24hr />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <UiFormField v-slot="{ handleChange, value }" name="endAt">
        <UiFormItem>
          <UiFormLabel>结束时间</UiFormLabel>
          <UiFormControl>
            <DatePicker :model-value="value" @update:model-value="handleChange" mode="dateTime" color="gray" locale="zh"
              trim-weeks is-required is24hr />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
    </div>
    <div class="grid grid-cols-2 gap-5" v-show="values.repeats">
      <UiFormField v-slot="{ handleChange, value }" name="startAt">
        <UiFormItem>
          <UiFormLabel>开始时间</UiFormLabel>
          <UiFormControl>
            <DayPicker :handleChange="handleChange" :value="value"></DayPicker>
            <DatePicker :model-value="value" @update:model-value="handleChange" mode="time" color="gray" locale="zh"
              hide-time-header is-required is24hr style="border: none !important;" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <UiFormField v-slot="{ handleChange, value }" name="endAt">
        <UiFormItem>
          <UiFormLabel>结束时间</UiFormLabel>
          <UiFormControl>
            <DayPicker :handleChange="handleChange" :value="value"></DayPicker>
            <DatePicker :model-value="value" @update:model-value="handleChange" mode="time" color="gray" locale="zh"
              hide-time-header is-required is24hr style="border: none !important;" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
    </div>

    <UiButton type="submit" :disabled="buttonLoading" class="w-24">
      <Loader2 class="w-4 h-4 mr-2 animate-spin" v-show="buttonLoading" />
      创建
    </UiButton>
  </form>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { TTime } from '~/types';

const { $api, $toast } = useNuxtApp();
const emit = defineEmits<{ (event: 'submitSuccess', time: TTime): void }>()

const formSchema = toTypedSchema(z.object({
  name: z.string({ required_error: '名称长度至少为1' }).max(50, '名称长度最大为50'),
  repeats: z.boolean(),
  startAt: z.date(),
  endAt: z.date(),
}));

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    repeats: false,
    startAt: new Date(),
    endAt: new Date(),
  }
});

const buttonLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  buttonLoading.value = true;
  try {
    const id = await $api.time.create.mutate(values);
    $toast.success('创建成功');
    resetForm();
    buttonLoading.value = false;
    emit('submitSuccess', Object.assign(values, { isActive: true, id }));
  } catch (err) {
    buttonLoading.value = false;
    useErrorHandler(err);
  }
});
</script>

<style>
.vc-container {
  width: 100%;
}
</style>