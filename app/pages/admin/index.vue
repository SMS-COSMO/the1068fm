<template>
  <div class="p-8">
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
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
    </div>
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
</script>
