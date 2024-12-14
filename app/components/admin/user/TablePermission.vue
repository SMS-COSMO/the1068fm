<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" size="xs">
        <Icon name="lucide:square-pen" />
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>修改权限</DialogTitle>
        <DialogDescription>
          更改用户的权限。
        </DialogDescription>
      </DialogHeader>

      <div class="flex gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                权限
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="permission in permissionNames" :key="permission.value">
              <TableCell class="font-medium">
                <Icon :name="permission.icon" class="mr-1" />
                {{ permission.label }}
              </TableCell>
              <TableCell class="text-right">
                <Switch
                  :checked="editPermission.includes(permission.value)"
                  @click="togglePermission(permission.value)"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            取消
          </Button>
        </DialogClose>
        <Button :disable="isPending" @click="mutate({ id, permissions: editPermission })">
          <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
          确认
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Badge v-for="permission in permissions" :key="permission" variant="outline">
    <Icon :name="permissionNames.find(x => x.value === permission)!.icon" class="mr-1" />
    {{ permissionNames.find(x => x.value === permission)?.label }}
  </Badge>
</template>

<script setup lang="ts">
import type { TPermission } from '~~/types';
import { permissionNames } from '~~/constants';

const { permissions } = defineProps<{
  id: string;
  permissions: TPermission[];
}>();

const { $trpc } = useNuxtApp();

const isOpen = ref(false);

const editPermission = ref(Array.from(permissions));

watch(isOpen, (v) => {
  if (!v)
    editPermission.value = Array.from(permissions);
});

const queryClient = useQueryClient();
const { mutate, isPending } = useMutation({
  mutationFn: $trpc.user.editPermission.mutate,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['user.list'] });
    editPermission.value = Array.from(permissions);
    isOpen.value = false;
  },
  onError: err => useErrorHandler(err),
});

function togglePermission(permission: TPermission) {
  if (!editPermission.value.includes(permission))
    editPermission.value.push(permission);
  else
    editPermission.value.splice(editPermission.value.indexOf(permission), 1);
}
</script>
