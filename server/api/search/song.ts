import { getMusicURL_v2 } from '~/server/lib/song';
import type { TSearchResponse } from '~~/types';
import { searchSchema } from '~~/types';

export default eventHandler(async (event) => {
  const paramsParse = await getValidatedQuery(event, params => searchSchema.safeParse(params));
  if (!paramsParse.success)
    throw createError({ message: 'Invalid params', status: 400 });

  const searchBaseURL = 'https://c6.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg';

  const res = await $fetch<TSearchResponse>(searchBaseURL, {
    method: 'GET',
    params: {
      _: Date.now(),
      cv: '4747474',
      ct: '24',
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: '0',
      platform: 'yqq.json',
      needNewCode: '1',
      uin: '0',
      g_tk_new_20200303: '5381',
      g_tk: '5381',
      hostUin: '0',
      is_xml: '0',
      key: paramsParse.data.key,
    },
    parseResponse(responseText) {
      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    },
  });
  const songMidArray = res.data.song.itemlist.map(item => item.mid);
  const urls: Record<string, string> = {};

  for (const mid of songMidArray) {
    const b = await getMusicURL_v2(mid);
    urls[mid] = b;
  }

  // const urls = await getMusicURL(songMidArray);
  const songList = res.data.song.itemlist.map(item => ({
    mid: item.mid,
    name: item.name,
    singer: item.singer,
    url: urls[item.mid],
  }));
  return songList;
});
