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
          <UiButton type="submit" class="mt-3">
            登录
          </UiButton>
        </form>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
const form = useForm()

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>
