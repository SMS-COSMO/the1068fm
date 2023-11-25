<template>
  <div class="flex flex-row items-center gap-5 p-5 h-screen max-w-2xl mx-auto">
    <UiCard class="w-full">
      <UiCardHeader>
        <UiCardTitle>
          (登录)
        </UiCardTitle>
        <UiCardDescription>
          placeholder
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
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
              </UiFormItem>
            </UiFormField>
          </div>
          <UiButton type="submit" class="mt-3" :disabled="buttonLoading">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-show="buttonLoading" />
            登录
          </UiButton>
        </form>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { Loader2 } from 'lucide-vue-next';
const { $api, $toast } = useNuxtApp();

const form = useForm();
const buttonLoading = ref(false);

const onSubmit = form.handleSubmit(async values => {
  buttonLoading.value = true;

  try {
    const res = await $api.user.login.mutate({ id: values.username, password: values.password });

    const userStore = useUserStore();
    userStore.login({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      userId: res.userId,
    });

    const router = useRouter();
    router.push('/manage');
    buttonLoading.value = false;
  } catch (err) {
    if (useIsTRPCClientError(err)) {
      $toast.error(err.message);
      buttonLoading.value = false;
    } else {
      $toast.error('未知错误');
    }
  }
});
</script>
