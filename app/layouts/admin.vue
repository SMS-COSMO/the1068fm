<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="border-b h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogosThe1068fm class="h-full w-full px-8 cursor-pointer" @click="navigateTo('/')" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>管理</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-if="userStore.permissions.includes('review')">
              <SidebarMenuButton @click="navigateTo('/admin/review')">
                <Icon name="lucide:music-4" />
                <span>歌曲审核</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem v-if="userStore.permissions.includes('arrange')">
              <SidebarMenuButton @click="navigateTo('/admin/arrange')">
                <Icon name="lucide:arrow-down-wide-narrow" />
                <span>排歌列表</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem v-if="userStore.permissions.includes('manageUser')">
              <SidebarMenuButton @click="navigateTo('/admin/user')">
                <Icon name="lucide:users" />
                <span>用户管理</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup v-if="userStore.permissions.includes('time')" class="border-t">
          <SidebarGroupLabel>开放时间</SidebarGroupLabel>
          <SidebarMenu>
            <TimeAvailability />
            <SidebarMenuItem>
              <SidebarMenuButton @click="navigateTo('/admin/time')">
                <Icon name="lucide:clock" />
                <span>设置开放时间</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="rounded-lg">
                    <Icon name="lucide:circle-user" size="20" />
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ userStore.name }}</span>
                    <span class="truncate text-xs">{{ userStore.id }}</span>
                  </div>
                  <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="rounded-lg">
                      <Icon name="lucide:circle-user" size="20" />
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ userStore.name }}</span>
                      <span class="truncate text-xs">{{ userStore.id }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout">
                  <Icon name="lucide:log-out" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header class="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.title">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    :href="index === 0 ? undefined : breadcrumb.href"
                    :class="{ 'text-foreground': index === breadcrumbs.length - 1 }"
                  >
                    {{ breadcrumb.title }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
          <DarkModeToggle class="ml-auto" />
        </div>
      </header>
      <main>
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { breadCrumb } from '~~/constants';

const userStore = useUserStore();

function logout() {
  userStore.logout();
  toast.success('登出成功');
  navigateTo('/login');
}

interface Item {
  title: string;
  href: string;
}

const route = useRoute();

function generateBreadcrumb(url: string): Item[] {
  const breadcrumbItems: Item[] = [];
  const segments = url.split('/').filter(segment => segment !== ''); // Remove empty segments

  // Construct breadcrumb for each segment
  let href = '';
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!.replace('.html', '');
    const segmentName = breadCrumb[segment] ?? '';
    href += `/${segment}`;
    breadcrumbItems.push({ title: segmentName, href });
  }
  return breadcrumbItems;
}

const breadcrumbs = computed(() => generateBreadcrumb(route.path));
</script>
