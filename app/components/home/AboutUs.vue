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
          <DialogTitle class="text-start text-xl font-bold">
            关于我们
          </DialogTitle>
        </DialogHeader>
        h

        <div class="flex items-center justify-between text-xs">
          <span class="text-muted-foreground">Made with ❤️ by <NuxtLink to="https://github.com/ZTL-UwU" class="font-semibold underline underline-offset-4">@ZTL-UwU</NuxtLink> from COSMO</span>
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
            <NuxtLink to="https://the1068.pictures/" target="_blank">
              <Button variant="outline" size="icon">
                <span class="font-serif text-xs font-semibold leading-[0.6rem]">
                  10<br>68
                </span>
              </Button>
            </NuxtLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>
