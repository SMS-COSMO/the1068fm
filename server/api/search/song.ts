import { getMusicURL } from '~/server/lib/song';
import type { TSearchResponse } from '~~/types';
import { searchSchema } from '~~/types';

export default eventHandler(async (event) => {
  const paramsParse = await getValidatedQuery(event, params => searchSchema.safeParse(params));
  if (!paramsParse.success)
    throw createError({ message: 'Invalid params', status: 400 });

  const searchBaseURL = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';

  const res = await $fetch<TSearchResponse>(searchBaseURL, {
    method: 'GET',
    params: {
      w: paramsParse.data.key,
      n: 5,
      format: 'json',
    },
    parseResponse(responseText) {
      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    },
  });
  const songMidArray = res.data.song.list.map(item => item.songmid).filter(item => item !== '');
  const urls = await getMusicURL(songMidArray);
  const songList = res.data.song.list.map(item => ({
    mid: item.songmid,
    name: item.songname,
    singer: item.singer.map(singer => singer.name).join(', ').trim(),
    url: urls[item.songmid],
    pic: `https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid}.jpg`,
  }));
  return songList;
});
