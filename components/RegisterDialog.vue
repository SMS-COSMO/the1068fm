<script setup lang="ts">
import { useForm } from 'vee-validate';
import { Loader2 } from 'lucide-vue-next';
import { z } from 'zod';
import { passwordRegex } from '~/constants/index';

const { $api, $toast } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  username: z.string({ required_error: '用户名长度应至少为4' })
    .min(4, { message: '用户名长度应至少为4' }).max(24, { message: '用户名超出长度范围' }),
  password: z
    .string({ required_error: '请输入密码' })
    .min(8, { message: '用户密码长度应至少为8' })
    .regex(passwordRegex, '密码必须包含大小写字母、数字与特殊符号'),
  confirm: z.string({ required_error: '请再次输入密码' }),
}).refine(data => data.password === data.confirm, {
  message: '密码不匹配',
  path: ['confirm'],
}));

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const buttonLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  buttonLoading.value = true;
  try {
    await $api.user.register.mutate({ id: values.username, password: values.password });
    $toast.success('创建成功');
    buttonLoading.value = false;
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
        <UiDialogTitle>创建新账户</UiDialogTitle>
      </UiDialogHeader>

      <form @submit="onSubmit">
        <UiFormField v-slot="{ componentField }" name="username">
          <UiFormItem>
            <UiFormLabel>用户名</UiFormLabel>
            <UiFormControl>
              <UiInput type="text" v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <div class="mt-3">
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem>
              <UiFormLabel>密码</UiFormLabel>
              <UiFormControl>
                <UiInput type="password" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="mt-3">
          <UiFormField v-slot="{ componentField }" name="confirm">
            <UiFormItem>
              <UiFormLabel>确认密码</UiFormLabel>
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
            注册
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
