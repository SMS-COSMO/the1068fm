<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <slot />
    </UiDialogTrigger>
    <UiDialogContent class="w-[92vw] rounded-md">
      <UiDialogHeader>
        <UiDialogTitle class="text-xl font-bold text-start">
          关于我们
        </UiDialogTitle>
      </UiDialogHeader>
      <div class="flex flex-col my-2">
        <NuxtImg src="/logo.svg" class="mx-auto mb-4 w-[50%]" />
        <section class="prose">
          <p>
            <em>the1068fm</em> 是由<b>COSMO智慧校园平台运研中心</b>为<b>风华子衿广播站</b>声声慢点歌节目开发的一体化系统，包含歌曲投稿，歌曲审核，一键排歌，导出歌单等功能。
          </p>
          <p>
            这个项目的代码是开源的，你可以在
            <NuxtLink to="https://github.com/SMS-COSMO/the1068fm" class="font-bold">
              <span>这里</span>
            </NuxtLink>
            查看源代码。期待各位同学的反馈！
          </p>
        </section>
        <NuxtImg src="/cosmo-logo.svg" class="mx-auto my-0 w-[80%]" />
        <section class="prose">
          <p>
            <b>COSMO智慧校园平台运研中心</b>是深圳中学七大校级学生组织之一，也是最年轻的校级学生组织。欢迎大家通过下方链接关注我们！
          </p>
          <section class="flex gap-4">
            <NuxtLink
              to="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg2NzUzOTIyOA==&scene=124#wechat_redirect"
              class="text-gray-600 flex justify-center items-center gap-1"
            >
              <WeChatLogo />
              微信公众号
            </NuxtLink>
            <NuxtLink to="https://github.com/SMS-COSMO/" class="text-gray-600 flex justify-center items-center gap-1">
              <span class="icon-[radix-icons--github-logo]" />
              GitHub
            </NuxtLink>
            <NuxtLink to="https://the1068.pictures/" class="text-gray-600 flex justify-center items-center gap-1 font-serif">
              the1068
            </NuxtLink>
          </section>
        </section>
      </div>
      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton type="button" variant="secondary" class="ml-auto px-6">
            好的
          </UiButton>
        </UiDialogClose>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
