<template>
  <ScrollArea class="h-[calc(100svh-4rem)] p-4">
    <div class="flex items-center pb-4">
      <Input
        class="max-w-sm"
        placeholder="搜索学号"
        :model-value="table.getColumn('id')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('id')?.setFilterValue($event)"
      />
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              无结果。
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        上一页
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        下一页
      </Button>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';

import type { RouterOutput } from '~~/types';
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import TablePermission from '~/components/admin/user/TablePermission.vue';

import SongHistorySheet from '~/components/SongHistorySheet.vue';
import Button from '~/components/ui/button/Button.vue';
import { valueUpdater } from '~/lib/utils';

definePageMeta({
  layout: 'admin',
});

const { $trpc } = useNuxtApp();

const { data, suspense } = useQuery({
  queryFn: () => $trpc.user.list.query(),
  queryKey: ['user.list'],
});
await suspense();

type a = RouterOutput['user']['list'][0];

const columns: ColumnDef<a>[] = [
  {
    accessorKey: 'id',
    header: '学号',
    cell: ({ row }) => h('span', { class: 'font-mono' }, row.getValue('id')),
  },
  {
    accessorKey: 'name',
    header: '姓名',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'songs',
    header: '点歌记录',
    cell: ({ row }) => h(
      SongHistorySheet,
      { songs: row.original.songs },
    ),
  },
  {
    accessorKey: 'permissions',
    header: '权限',
    cell: ({ row }) => h(
      'div',
      { class: 'flex gap-1' },
      h(TablePermission, {
        id: row.original.id,
        permissions: row.original.permissions,
      }),
    ),
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data: data as any,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value; },
    get columnFilters() { return columnFilters.value; },
    get columnVisibility() { return columnVisibility.value; },
    get rowSelection() { return rowSelection.value; },
    get expanded() { return expanded.value; },
  },
  initialState: {
    pagination: {
      pageSize: 20,
    },
  },
});
</script>
