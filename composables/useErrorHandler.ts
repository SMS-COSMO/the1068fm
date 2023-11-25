export const useErrorHandler = async (err: unknown) => {
  if (useIsTRPCClientError(err)) {
    if (err.data?.zodError) {
      for (const issue of err.data.zodError)
        $toast.error(issue.message);
    }
    $toast.error(err.message);
  } else {
    $toast.error('未知错误');
  }
}