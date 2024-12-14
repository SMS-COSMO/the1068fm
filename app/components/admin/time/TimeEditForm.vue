<template>
  <CardHeader>
    <CardTitle>
      修改开放时间
    </CardTitle>
  </CardHeader>
  <CardContent>
    <form class="flex flex-col gap-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>名称</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ value, handleChange }" name="isActive">
        <FormItem>
          <FormLabel>启用</FormLabel>
          <FormControl class="block">
            <Switch :checked="value" @update:checked="handleChange" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ value, handleChange }" name="repeats">
        <FormItem>
          <FormLabel class="block">
            每周重复
          </FormLabel>
          <FormControl>
            <Switch :checked="value" @update:checked="handleChange" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div v-show="!values.repeats" class="grid grid-cols-2 gap-10">
        <FormField v-slot="{ handleChange, value }" name="startAt">
          <FormItem>
            <FormLabel class="block">
              开始时间
            </FormLabel>
            <DatePicker
              borderless
              :model-value="value" mode="dateTime" color="gray" locale="zh" trim-weeks
              title-position="left"
              is-required is24hr class="rounded-lg border !bg-background shadow-sm"
              :is-dark="isDark"
              expanded
              @update:model-value="handleChange"
            />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ handleChange, value }" name="endAt">
          <FormItem>
            <FormLabel class="block">
              结束时间
            </FormLabel>
            <DatePicker
              borderless
              :model-value="value" mode="dateTime" color="gray" locale="zh" trim-weeks
              title-position="left"
              is-required is24hr class="rounded-lg border !bg-background shadow-sm"
              :is-dark="isDark"
              expanded
              @update:model-value="handleChange"
            />
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div v-show="values.repeats" class="grid grid-cols-2 gap-10">
        <FormField v-slot="{ handleChange, value }" name="startAt">
          <FormItem>
            <FormLabel class="block">
              开始时间
            </FormLabel>
            <FormControl>
              <AdminTimeDayPicker :handle-change="handleChange" :value="value" />
              <DatePicker
                :model-value="value" mode="time" color="gray" locale="zh" hide-time-header
                is-required is24hr style="border: none !important" @update:model-value="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ handleChange, value }" name="endAt">
          <FormItem>
            <FormLabel class="block">
              结束时间
            </FormLabel>
            <FormControl>
              <AdminTimeDayPicker :handle-change="handleChange" :value="value" />
              <DatePicker
                :model-value="value" mode="time" color="gray" locale="zh" hide-time-header
                is-required is24hr style="border: none !important" @update:model-value="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="mt-4 flex gap-4">
        <Button type="submit" :disabled="isPending">
          <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
          修改
        </Button>
        <Button type="button" variant="outline" @click="remove(time.id)">
          删除
        </Button>
      </div>
    </form>
  </CardContent>
</template>

<script setup lang="ts">
import type { RouterOutput } from '~~/types';
import { DatePicker } from '@ztl-uwu/v-calendar';
import * as z from 'zod';

const { time } = defineProps<{
  time: RouterOutput['time']['list'][0];
}>();

const { $trpc } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  name: z.string({ required_error: '名称长度至少为1' }).max(50, '名称长度最大为50'),
  repeats: z.boolean(),
  startAt: z.date(),
  endAt: z.date(),
  isActive: z.boolean(),
}));

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ...time,
  },
});

const isDark = computed(() => useColorMode().preference === 'dark');

const queryClient = useQueryClient();
const { mutate: modify, isPending } = useMutation({
  mutationFn: $trpc.time.modify.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['time.list'] });
    queryClient.invalidateQueries({ queryKey: ['time.currently'] });
    toast.success('修改成功');
  },
  onError: err => useErrorHandler(err),
});

const { mutate: remove } = useMutation({
  mutationFn: $trpc.time.remove.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['time.list'] });
    queryClient.invalidateQueries({ queryKey: ['time.currently'] });
    toast.success('删除成功');
  },
  onError: err => useErrorHandler(err),
});

const onSubmit = handleSubmit(async (values) => {
  modify({
    id: time.id,
    ...values,
  });
});
</script>
