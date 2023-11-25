<template>
    <UiDialog>
        <UiDialogTrigger as-child>
            <slot></slot>
        </UiDialogTrigger>
        <UiDialogContent class="w-[92vw] rounded-md">
            <UiDialogHeader>
                <UiDialogTitle class="text-xl font-bold text-start">规则介绍</UiDialogTitle>
            </UiDialogHeader>
            <div class="prose">
            <ol>
                <li>会控制每天的歌曲风格，使各个风格的歌曲平均分配，因此有部分通过审核的歌曲不会播放，相同曲风的歌曲以投稿时间先后播放</li>
                <li>与上周歌单有重复的歌曲不播放</li>
                <li>最终选取约50首歌曲播放</li>
                <li>希望大家在点歌时注意维护食堂的氛围</li>
                <li>最终审核解释权由广播站所有</li>
            </ol>
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