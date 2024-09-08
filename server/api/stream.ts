import { streamSchema } from '~~/types/stream';
import { getMusicURL } from '~/server/lib/song';

export default eventHandler(async (event) => {
  const paramsParse = await getValidatedQuery(event, params => streamSchema.safeParse(params));
  if (!paramsParse.success)
    throw createError({ message: 'Invalid params', status: 400 });
  return await getMusicURL([paramsParse.data.songMid]);
});
