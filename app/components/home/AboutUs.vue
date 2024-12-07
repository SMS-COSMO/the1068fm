<template>
  <ClientOnly>
    <template #fallback>
      <Button variant="outline" class="w-full">
        <Icon name="lucide:info" class="mr-2" />
        关于我们
      </Button>
    </template>

    <Dialog>
      <DialogTrigger>
        <Button variant="outline" class="w-full">
          <Icon name="lucide:info" class="mr-2" />
          关于我们
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-start">
            关于我们
          </DialogTitle>
        </DialogHeader>
        h

        <div class="text-xs flex justify-between items-center">
          <span class="text-muted-foreground">Made with ❤️ by <NuxtLink to="https://github.com/ZTL-UwU" class="underline underline-offset-4 font-semibold">@ZTL-UwU</NuxtLink></span>
          <div class="flex gap-2">
            <NuxtLink to="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg2NzUzOTIyOA==&scene=124#wechat_redirect" target="_blank">
              <Button variant="outline" size="icon">
                <Icon name="tabler:brand-wechat" />
              </Button>
            </NuxtLink>
            <NuxtLink to="https://github.com/SMS-COSMO/the1068fm" target="_blank">
              <Button variant="outline" size="icon">
                <Icon name="lucide:github" />
              </Button>
            </NuxtLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>
