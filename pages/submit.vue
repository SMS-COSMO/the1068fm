<template>
  <div class="mx-8">
    <UiCard class="mt-16">
      <UiCardHeader>
        <UiCardTitle>
          <UiButton variant="outline" size="icon" @click="back" class="mr-2">
            <ChevronLeft class="w-4 h-4" />
          </UiButton>
          投稿
        </UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <form @submit="onSubmit">
          <UiFormField v-slot="{ componentField }" name="name">
            <UiFormItem>
              <UiFormLabel>歌曲名</UiFormLabel>
              <UiFormControl>
                <UiInput type="text" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <div class="mt-3">
            <UiFormField v-slot="{ componentField }" name="creator">
              <UiFormItem>
                <UiFormLabel>歌手</UiFormLabel>
                <UiFormControl>
                  <UiInput type="text" v-bind="componentField" />
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="mt-3">
            <UiFormField v-slot="{ componentField }" name="submitterName">
              <UiFormItem>
                <UiFormLabel>提交者</UiFormLabel>
                <UiFormControl>
                  <UiInput type="text" v-bind="componentField" />
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="mt-3">
            <UiFormField v-slot="{ componentField }" name="submitterGrade">
              <UiFormItem>
                <UiFormLabel>年级</UiFormLabel>
                <UiFormControl>
                  <UiInput type="text" v-bind="componentField" />
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="mt-3">
            <UiFormField v-slot="{ componentField }" name="submitterClass">
              <UiFormItem>
                <UiFormLabel>班级</UiFormLabel>
                <UiFormControl>
                  <UiInput type="number" v-bind="componentField" />
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>
          <UiButton type="submit" class="mt-3" :disabled="buttonLoading">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" v-show="buttonLoading" />
            提交
          </UiButton>
        </form>
      </UiCardContent>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, '歌名长度至少为1').max(50, '歌名长度最大为50'),
  creator: z.string().min(1, '歌手名长度至少为1').max(50, '歌手长度最大为50'),
  submitterName: z.string().min(2, '申请者名字长度至少为2').max(15, '申请者名字长度最大为15'),
  submitterGrade: z.number().min(1000).max(5000), // problem for people in 5000s
  submitterClass: z.number().min(0, '班级号应大于0').max(100, '班级号应小于100'),
  type: z.enum(['normal', 'withMsg'], { errorMap: () => ({ message: '提交了不存在的歌曲类型' }) }),
}));

const form = useForm({
  validationSchema: formSchema,
});

const buttonLoading = ref(false);
const onSubmit = form.handleSubmit(async values => { });

const back = () => {
  const router = useRouter();
  router.back();
};
</script>