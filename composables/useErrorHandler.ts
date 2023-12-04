export async function useErrorHandler(err: unknown) {
  const { $toast } = useNuxtApp();
  if (useIsTRPCClientError(err)) {
    if (err.data?.zodError) {
      for (const issue of err.data.zodError)
        $toast.error(issue.message);
    } else { $toast.error(err.message); }
  } else {
    $toast.error('未知错误');
  }
}
