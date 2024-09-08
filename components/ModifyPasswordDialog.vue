<script setup lang="ts">
import { useForm } from 'vee-validate';
import { Loader2 } from 'lucide-vue-next';
import z from 'zod';
import { passwordRegex } from '~/constants';

const { $api, $toast } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  oldPassword: z.string({ required_error: '请输入密码' }).min(8, { message: '用户密码长度应至少为8' }),
  newPassword: z
    .string({ required_error: '请输入密码' })
    .min(8, { message: '用户密码长度应至少为8' })
    .regex(passwordRegex, '密码必须包含大小写字母、数字与特殊符号'),
}));

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});
const buttonLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  buttonLoading.value = true;
  try {
    await $api.user.modifyPassword.mutate({ oldPassword: values.oldPassword, newPassword: values.newPassword });
    $toast.success('修改成功');
    buttonLoading.value = false;
    resetForm();
  } catch (err) {
    useErrorHandler(err);
    buttonLoading.value = false;
  }
});
</script>

<template>
  <UiDialog>
    <UiDialogTrigger class="w-full">
      <slot />
    </UiDialogTrigger>
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle>修改密码</UiDialogTitle>
      </UiDialogHeader>

      <form @submit="onSubmit">
        <UiFormField v-slot="{ componentField }" name="oldPassword">
          <UiFormItem>
            <UiFormLabel>旧密码</UiFormLabel>
            <UiFormControl>
              <UiInput type="password" v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <div class="mt-3">
          <UiFormField v-slot="{ componentField }" name="newPassword">
            <UiFormItem>
              <UiFormLabel>新密码</UiFormLabel>
              <UiFormControl>
                <UiInput type="password" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <UiDialogFooter>
          <UiButton type="submit" class="mt-3" :disabled="buttonLoading">
            <Loader2 v-show="buttonLoading" class="w-4 h-4 mr-2 animate-spin" />
            修改
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
