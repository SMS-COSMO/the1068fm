<template>
  <CardHeader>
    <CardTitle>
      创建开放时间
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
              expanded
              :is-dark="isDark"
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
              expanded
              :is-dark="isDark"
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
                is-required is24hr style="border: none !important" class="!bg-background" @update:model-value="handleChange"
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
                is-required is24hr style="border: none !important" class="!bg-background"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="mt-4">
        <Button type="submit" :disabled="isPending">
          <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
          创建
        </Button>
      </div>
    </form>
  </CardContent>
</template>

<script setup lang="ts">
import { DatePicker } from '@ztl-uwu/v-calendar';
import * as z from 'zod';

const { $trpc } = useNuxtApp();

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
  },
});

const isDark = computed(() => useColorMode().preference === 'dark');

const queryClient = useQueryClient();
const { mutate, isPending } = useMutation({
  mutationFn: $trpc.time.create.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['time.list'] });
    queryClient.invalidateQueries({ queryKey: ['time.currently'] });
    toast.success('创建成功');
    resetForm();
  },
  onError: err => useErrorHandler(err),
});

const onSubmit = handleSubmit(async (values) => {
  mutate(values);
});
</script>
