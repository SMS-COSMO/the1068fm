<template>
  <div class="flex h-svh w-full justify-center lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            登录
          </h1>
          <p class="text-balance text-muted-foreground">
            使用希悦账号登录 <span class="font-mono">the1068fm</span>
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">学号</Label>
            <Input
              id="id"
              v-model="info.id"
              type="text"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">密码</Label>
            </div>
            <Input
              id="password"
              v-model="info.password"
              type="password"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disable="isPending" @click="login(info)">
            <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
            登录
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          第一次登录会自动注册。
        </div>
      </div>
    </div>
    <div class="hidden items-center justify-center bg-muted lg:flex">
      <LogosThe1068fm />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();

const info = reactive({
  id: '',
  password: '',
});

const { mutate: login, isPending } = useMutation({
  mutationFn: $trpc.user.login.mutate,
  onSuccess: (res) => {
    useUserStore().login(res);
    toast.success('登录成功');
    navigateTo('/');
  },
  onError: err => useErrorHandler(err),
});
</script>
