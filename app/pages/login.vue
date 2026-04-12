<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
      <div class="flex flex-col gap-6">
        <Card class="overflow-hidden">
          <CardContent class="grid p-0 md:grid-cols-2">
            <div class="p-6 md:p-8">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col items-center text-center">
                  <h1 class="text-2xl font-bold">
                    登录
                  </h1>
                  <p class="text-balance text-muted-foreground">
                    使用希悦账号登录 <span class="font-mono">the1068fm</span>
                  </p>
                </div>
                <Tabs default-value="password">
                  <TabsList class="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="password">
                      账号密码
                    </TabsTrigger>
                    <TabsTrigger value="phone">
                      手机验证码
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="password">
                    <div class="grid gap-6">
                      <div class="grid gap-2">
                        <Label for="id">学号</Label>
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
                      <Button type="submit" class="w-full" :disable="passwordPending" @click="passwordLogin(info)">
                        <Icon v-if="passwordPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
                        登录
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="phone">
                    <div class="grid gap-6">
                      <div class="grid gap-2">
                        <Label for="phone">手机号<span class="text-xs leading-none text-muted-foreground">（希悦绑定）</span></Label>
                        <Input
                          id="phone"
                          v-model="infoPhone.phone"
                          type="text"
                          required
                        />
                      </div>
                      <div class="grid gap-2">
                        <div class="flex items-center">
                          <Label for="otp">验证码</Label>
                        </div>
                        <PinInput
                          id="otp"
                          v-model="infoPhone.otp"
                          placeholder="○"
                          @complete="phoneLoginMutation({ ...infoPhone })"
                        >
                          <PinInputGroup class="shadow-sm">
                            <PinInputInput
                              v-for="(id, index) in 4"
                              :key="id"
                              :index="index"
                              class="lg:w-12"
                            />
                          </PinInputGroup>
                          <Button :disabled="isActive" variant="outline" class="w-full" @click="generatePhoneCode">
                            {{ isActive ? count : '获取验证码' }}
                          </Button>
                        </PinInput>
                      </div>
                      <Button type="submit" class="w-full" :disable="phonePending" @click="phoneLoginMutation({ ...infoPhone })">
                        <Icon v-if="phonePending" name="lucide:loader-circle" class="mr-2 animate-spin" />
                        登录
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                <div class="text-center text-sm">
                  第一次登录会自动注册。
                </div>
              </div>
            </div>
            <div class="hidden items-center justify-center bg-muted md:flex">
              <LogosThe1068fm class="w-[250px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp();

const info = reactive({
  id: '',
  password: '',
});

const { mutate: passwordLogin, isPending: passwordPending } = useMutation({
  mutationFn: $trpc.user.login.mutate,
  onSuccess: (res) => {
    useUserStore().login(res);
    toast.success('登录成功');
    navigateTo('/');
  },
  onError: err => useErrorHandler(err),
});

const infoPhone = reactive({
  phone: '',
  otp: [],
  reminderId: '',
});

const { count, dec, reset } = useCounter(60);
const { isActive, pause, resume } = useTimeoutPoll(() => {
  dec();
  if (count.value === 0) {
    pause();
    reset();
  }
}, 1000, {
  immediate: false,
});

async function generatePhoneCode() {
  resume();
  try {
    if (infoPhone.phone.length !== 11 || infoPhone.phone.match(/[^0-9]/g)) {
      toast.error('请输入正确的手机号');
      pause();
      reset();
      return;
    }

    const res = await $trpc.user.generatePhoneCode.mutate({ phone: infoPhone.phone });
    infoPhone.reminderId = res.reminder_id;
  } catch (err) {
    pause();
    reset();
    useErrorHandler(err);
  }
}

const { mutate: phoneLoginMutation, isPending: phonePending } = useMutation({
  mutationFn: $trpc.user.phoneLogin.mutate,
  onSuccess: (res) => {
    useUserStore().login(res);
    toast.success('登录成功');
    navigateTo('/');
  },
  onError: err => useErrorHandler(err),
});
</script>
