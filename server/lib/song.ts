import type { TStreamResponse } from '~~/types/stream';

export async function getMusicURL(midArray: string[]) {
  const musicBaseURL = 'https://u6.y.qq.com/cgi-bin/musicu.fcg';
  const guid = Math.round(2147483647 * Math.random()) * Date.now() % 1e10;
  const res = await $fetch<TStreamResponse>(musicBaseURL, {
    method: 'POST',
    params: {
      _: Date.now(),
    },
    body: `
        {
            "comm": {
              "cv": 4747474,
              "ct": 24,
              "format": "json",
              "inCharset": "utf-8",
              "outCharset": "utf-8",
              "notice": 0,
              "platform": "yqq.json",
              "needNewCode": 1,
              "uin": 0,
              "g_tk_new_20200303": 5381,
              "g_tk": 5381
            },
            "req_1": {
              "module": "vkey.GetVkeyServer",
              "method": "CgiGetVkey",
              "param": {
                "guid": "${guid}",
                "songmid": ${JSON.stringify(midArray)},
                "songtype": [
                  0
                ],
                "uin": "0",
                "loginflag": 1,
                "platform": "20"
              }
            }
          }
        `,
    parseResponse(responseText) {
      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    },
  });
  const data: Record<string, string> = {};
  if (res.code !== 0 || res.req_1.code !== 0)
    throw createError({ message: 'Failed to get music URL', status: 500 });
  for (const item of res.req_1.data.midurlinfo) {
    if (!item.purl)
      data[item.songmid] = '';
    else
      data[item.songmid] = `https://ws.stream.qqmusic.qq.com/${item.purl}`;
  }
  return data;
}
