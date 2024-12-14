<template>
  <ClientOnly>
    <template #fallback>
      <slot />
    </template>

    <Dialog>
      <DialogTrigger>
        <slot />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            关于我们
          </DialogTitle>
        </DialogHeader>

        <LogosThe1068fm class="mx-auto w-1/2" />
        <section class="prose">
          <p>
            <em>the1068fm</em> 是由 <b>COSMO 智慧校园平台运研中心</b> 为 <b>风华子衿广播站</b> 声声慢点歌节目开发的一体化系统，包含歌曲投稿，歌曲审核，一键排歌，导出歌单等功能。
          </p>
          <p>
            这个项目的代码是开源的，你可以在
            <NuxtLink to="https://github.com/SMS-COSMO/the1068fm" class="font-semibold underline underline-offset-4">
              <span>这里</span>
            </NuxtLink>
            查看源代码。期待各位同学的反馈！
          </p>
        </section>
        <LogosCosmo class="mx-auto w-4/5" />
        <section class="prose">
          <p>
            <b>COSMO 智慧校园平台运研中心</b> 是深圳中学七大校级学生组织之一，也是最年轻的校级学生组织。欢迎大家通过下方链接关注我们！
          </p>
        </section>

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
