<template>
  <div class="flex h-[calc(100svh-4rem)] flex-col gap-4 p-4">
    <div class="flex w-full max-w-sm items-center gap-1.5">
      <Input v-model="newWord" placeholder="添加屏蔽词" />
      <Button
        type="submit"
        :disabled="isPending"
        @click="create({ word: newWord.trim() })"
      >
        <Icon v-if="isPending" name="lucide:loader-circle" class="mr-2 animate-spin" />
        添加
      </Button>
    </div>
    <div class="flex h-[calc(100svh-9rem)] flex-col flex-wrap content-start gap-x-4 gap-y-2 overflow-x-scroll">
      <Badge
        v-for="word in data"
        :key="word.word"
        variant="outline" class="relative w-40 truncate py-1.5"
      >
        {{ word.word }}
        <Icon
          name="lucide:x"
          class="absolute right-2 hover:cursor-pointer"
          @click="remove({ word: word.word })"
        />
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
const { $trpc } = useNuxtApp();

const { data, suspense } = useQuery({
  queryFn: () => $trpc.blockWords.list.query(),
  queryKey: ['blockWords.list'],
});
await suspense();

const newWord = ref('');

const queryClient = useQueryClient();
const { mutate: create, isPending } = useMutation({
  mutationFn: $trpc.blockWords.create.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blockWords.list'] });
    newWord.value = '';
  },
  onError: err => useErrorHandler(err),
});

const { mutate: remove } = useMutation({
  mutationFn: $trpc.blockWords.remove.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blockWords.list'] });
    newWord.value = '';
  },
  onError: err => useErrorHandler(err),
});
</script>
