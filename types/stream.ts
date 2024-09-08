import { z } from 'zod';

export const streamSchema = z.object({
  songMid: z.string(),
});
export interface TMidUrlInfoItem {
  filename: string;
  purl: string;
  songmid: string;
  vkey: string;
}
export interface TStreamResponse {
  code: number;
  req_1: {
    code: number;
    data: {
      midurlinfo: TMidUrlInfoItem[];
    };
  };
}
