<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { TTime } from '~/types';

const props = defineProps<{ time: TTime }>();

const emit = defineEmits<{
  (event: 'submitSuccess', time: TTime): void
  (event: 'deleteSuccess', id: string): void
}>();

const { $api, $toast } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  name: z.string({ required_error: '名称长度至少为1' }).max(50, '名称长度最大为50'),
  repeats: z.boolean(),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
  isActive: z.boolean(),
}));

const { handleSubmit, setValues, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.time.name,
    startAt: props.time.startAt,
    endAt: props.time.endAt,
    repeats: props.time.repeats,
    isActive: props.time.isActive,
  },
});

watch(props, (newValue: typeof props) => {
  setValues({
    name: newValue.time.name,
    startAt: newValue.time.startAt,
    endAt: newValue.time.endAt,
    repeats: newValue.time.repeats,
    isActive: newValue.time.isActive,
  });
});

const submitButtonLoading = ref(false);
const onSubmit = handleSubmit(async (values) => {
  submitButtonLoading.value = true;
  try {
    const withId = Object.assign(values, { id: props.time.id });
    const notNullWithId = {
      id: withId.id,
      name: withId.name,
      repeats: withId.repeats,
      isActive: withId.isActive,
      startAt: withId.startAt ?? props.time.startAt,
      endAt: withId.endAt ?? props.time.endAt,
    };

    await $api.time.modify.mutate(notNullWithId);
    $toast.success('修改成功');
    emit('submitSuccess', notNullWithId);
    submitButtonLoading.value = false;
  } catch (err) {
    submitButtonLoading.value = false;
    useErrorHandler(err);
  }
});

const deleteButtonLoading = ref(false);
async function deleteTime() {
  deleteButtonLoading.value = true;
  try {
    await $api.time.remove.mutate({ id: props.time.id });
    $toast.success('删除成功');
    emit('deleteSuccess', props.time.id);
    deleteButtonLoading.value = false;
  } catch (err) {
    deleteButtonLoading.value = false;
    useErrorHandler(err);
  }
}
</script>

<template>
  <form class="grid grid-cols-1 gap-4" @submit="onSubmit">
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
          <UiSwitch id="airplane-mode" :checked="value" @update:checked="handleChange" />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <div v-show="!values.repeats" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <UiFormField v-slot="{ handleChange, value }" name="startAt">
        <UiFormItem>
          <UiFormLabel>开始时间</UiFormLabel>
          <UiFormControl>
            <DatePicker
              :model-value="value" mode="dateTime" color="gray" locale="zh" trim-weeks
              is-required is24hr @update:model-value="handleChange"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <UiFormField v-slot="{ handleChange, value }" name="endAt">
        <UiFormItem>
          <UiFormLabel>结束时间</UiFormLabel>
          <UiFormControl>
            <DatePicker
              :model-value="value" mode="dateTime" color="gray" locale="zh" trim-weeks
              is-required is24hr @update:model-value="handleChange"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
    </div>
    <div v-show="values.repeats" class="grid grid-cols-2 gap-5">
      <UiFormField v-slot="{ handleChange, value }" name="startAt">
        <UiFormItem>
          <UiFormLabel>开始时间</UiFormLabel>
          <UiFormControl>
            <DayPicker :handle-change="handleChange" :value="value" />
            <DatePicker
              :model-value="value" mode="time" color="gray" locale="zh" hide-time-header
              is-required is24hr style="border: none !important;" @update:model-value="handleChange"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>

      <UiFormField v-slot="{ handleChange, value }" name="endAt">
        <UiFormItem>
          <UiFormLabel>结束时间</UiFormLabel>
          <UiFormControl>
            <DayPicker :handle-change="handleChange" :value="value" />
            <DatePicker
              :model-value="value" mode="time" color="gray" locale="zh" hide-time-header
              is-required is24hr style="border: none !important;" @update:model-value="handleChange"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
    </div>

    <UiFormField v-slot="{ value, handleChange }" name="isActive">
      <UiFormItem>
        <UiFormLabel>是否启用</UiFormLabel>
        <UiFormControl>
          <UiSwitch :checked="value" @update:checked="handleChange" />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>

    <div>
      <UiButton class="w-24" type="submit" :disabled="submitButtonLoading">
        <Loader2 v-show="submitButtonLoading" class="w-4 h-4 mr-2 animate-spin" />
        修改
      </UiButton>
      <UiButton type="button" variant="destructive" class="ml-2 w-24" :disabled="deleteButtonLoading" @click="deleteTime">
        <Loader2 v-show="deleteButtonLoading" class="w-4 h-4 mr-2 animate-spin" />
        删除
      </UiButton>
    </div>
  </form>
</template>
