<template>
  <div class="p-8">
    <div class="grid gap-4 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            历史投稿数
          </CardTitle>
          <Icon name="lucide:chart-no-axes-column" class="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ data?.songCount }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            用户数
          </CardTitle>
          <Icon name="lucide:users" class="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ data?.userCount }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            投稿状态
          </CardTitle>
          <Icon name="lucide:clock" class="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            <TimeAvailability class="px-0" />
          </div>
        </CardContent>
      </Card>
    </div>
    <Card class="mt-8 h-max">
      <CardHeader>
        <CardTitle>
          投稿统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          v-if="data?.chart"
          index="date"
          :data="data.chart"
          :categories="['approved', 'dropped', 'pending', 'rejected', 'used', 'ghost']"
          :rounded-corners="4"
        />
      </CardContent>
    </Card>

    <!-- <Button class="mt-8" variant="outline" @click="getMissingSingerMetaMutation">
      <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
      获取缺失的歌手元数据
    </Button> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
const userStore = useUserStore();

const { $trpc } = useNuxtApp();

if (!userStore.permissions.includes('admin'))
  navigateTo('/');

const { data, suspense } = useQuery({
  queryFn: () => $trpc.stats.dashboard.query(),
  queryKey: ['stats.dashboard'],
});

await suspense();

// const { mutate: getMissingSingerMetaMutation, isPending } = useMutation({
//   mutationFn: () => $trpc.song.getMissingSingerMeta.mutate(),
//   onSuccess: () => {
//     toast.success({
//       title: '成功',
//       description: '已成功获取缺失的歌手元数据',
//     });
//   },
//   onError: err => useErrorHandler(err),
// });
</script>
