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

export async function getMusicURL_v2(mid: string) {
  const res = await $fetch<any>(
    `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22${mid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`,
    {
      parseResponse(responseText) {
        try {
          return JSON.parse(responseText);
        } catch {
          return responseText;
        }
      },
    },
  );

  const url_b = res.req_0.data.testfile2g.split('?');
  return `https://ws.stream.qqmusic.qq.com/${res.req_0.data.midurlinfo[0].filename}?${url_b[1]}&src=${url_b[0]}`;
}
