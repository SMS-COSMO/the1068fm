<template>
    <UiDialog>
        <UiDialogTrigger as-child>
            <slot></slot>
        </UiDialogTrigger>
        <UiDialogContent class="w-[92vw] rounded-md">
            <UiDialogHeader>
                <UiDialogTitle class="text-xl font-bold text-start">关于我们</UiDialogTitle>
            </UiDialogHeader>
            <div class="flex flex-col my-2">
                <NuxtImg preload src="/logo.svg" class="mx-auto mb-6" as="image"></NuxtImg>
                <section class="prose">
                    <p>
                        <em>the1068fm</em> 是由<b>COSMO智慧校园平台运研中心</b>为<b>风华子衿广播站</b>声声慢点歌节目开发的一体化系统，包含歌曲投稿，歌曲审核，一键排歌等功能。
                    </p>
                    <p>
                        <b>COSMO智慧校园平台运研中心</b>是深圳中学七大校级学生组织之一，也是最年轻的校级学生组织。欢迎大家关注我们的微信公众号！
                    </p>
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