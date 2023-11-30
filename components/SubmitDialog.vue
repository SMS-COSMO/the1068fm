<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <slot></slot>
    </UiDialogTrigger>
    <UiDialogContent class="w-[92vw] rounded-md">
      <UiDialogHeader>
        <UiDialogTitle class="text-xl font-bold text-start">歌曲投稿</UiDialogTitle>
      </UiDialogHeader>
      <UiScrollArea class="max-h-[calc(100svh-10rem)]">
        <form @submit="onSubmit" class="grid grid-cols-1 gap-4">
          <UiFormField v-slot="{ componentField }" name="type">
            <UiFormItem>
              <UiFormLabel>投稿类型</UiFormLabel>
              <UiSelect v-bind="componentField">
                <UiFormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="请选择一种类型" />
                  </UiSelectTrigger>
                </UiFormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem value="normal">
                      001 一般投稿
                    </UiSelectItem>
                    <UiSelectItem value="withMsg">
                      002 带留言投稿
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="name">
            <UiFormItem>
              <UiFormLabel>歌曲名</UiFormLabel>
              <UiFormControl>
                <UiInput type="text" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="creator">
            <UiFormItem>
              <UiFormLabel>歌手</UiFormLabel>
              <UiFormControl>
                <UiInput type="text" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="submitterName">
            <UiFormItem>
              <UiFormLabel>提交者姓名</UiFormLabel>
              <UiFormControl>
                <UiInput type="text" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <div class="flex gap-2">
            <UiFormField v-slot="{ componentField }" name="submitterGrade">
              <UiFormItem class="grow">
                <UiFormLabel>年级</UiFormLabel>
                <UiFormControl>
                  <UiSelect v-bind="componentField">
                    <UiFormControl>
                      <UiSelectTrigger>
                        <UiSelectValue placeholder="选择" class="" />
                      </UiSelectTrigger>
                    </UiFormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem value="1" class="text-sm">
                          高一
                        </UiSelectItem>
                        <UiSelectItem value="2" class="text-sm">
                          高二
                        </UiSelectItem>
                      </UiSelectGroup>
                    </UiSelectContent>
                  </UiSelect>
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>

            <UiFormField v-slot="{ componentField }" name="submitterClass" class="">
              <UiFormItem class="flex flex-col flex-1 basis-2/3">
                <UiFormLabel>班级（请填数字）</UiFormLabel>
                <UiFormControl>
                  <UiInput type="number" v-bind="componentField" />
                </UiFormControl>
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
          </div>

          <UiFormField v-slot="{ componentField }" name="message" v-if="values.type === 'withMsg'">
            <UiFormItem>
              <UiFormLabel>投稿留言</UiFormLabel>
              <UiFormControl>
                <UiTextarea v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiDialogFooter>
            <UiButton type="submit" class="mt-3 ml-auto px-6 font-bold text-md flex items-center justify-center"
              :disabled="buttonLoading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-show="buttonLoading" />
              提交
            </UiButton>
          </UiDialogFooter>
        </form>
      </UiScrollArea>
    </UiDialogContent>
  </UiDialog>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useSongStore } from '~/stores/song';

const { $toast, $api } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  name: z.string({ required_error: '歌名长度至少为1' })
    .min(1, '歌名长度至少为1').max(50, '歌名长度最大为50'),
  creator: z.string({ required_error: '歌手名长度至少为1' })
    .min(1, '歌手名长度至少为1').max(50, '歌手长度最大为50'),
  submitterName: z.string({ required_error: '提交者名字长度至少为2' })
    .min(2, '提交者名字长度至少为2').max(15, '提交者名字长度最大为15'),
  submitterGrade: z.coerce.number({ invalid_type_error: '请填一个数字' })
    .int('请填一个整数').min(1, '年级为1或2').max(2, '年级为1或2'),
  submitterClass: z.coerce.number({ invalid_type_error: '请填一个数字' })
    .min(0, '班级号应大于0').max(100, '班级号应小于100'),
  type: z.enum(
    ['normal', 'withMsg'],
    { errorMap: () => ({ message: '提交了不存在的歌曲类型' }) }
  ),
  message: z.string().nullish(),
}));

const { handleSubmit, values, resetForm } = useForm({
  validationSchema: formSchema,
});

const [buttonLoading, toggleLoading] = useToggle(false);
const onSubmit = handleSubmit(async (values) => {
  toggleLoading()
  try {
    const id = await $api.song.create.mutate(values);

    const songStore = useSongStore();
    songStore.submitSong(id);

    $toast.success('提交成功！')
    resetForm();
  } catch (err) {
    useErrorHandler(err);
  }
  toggleLoading();
});
</script>