export async function useTrpcAsyncData<T>(
  handler: () => Promise<T>,
) {
  try {
    return await handler();
  } catch (err) {
    useErrorHandler(err);
  }
  return undefined;
}
