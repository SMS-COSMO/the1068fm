import { z } from 'zod';

export const searchSchema = z.object({
  key: z.string(),
});

export interface TItem {
  docid: string;
  id: string;
  mid: string;
  name: string;
  singer: string;
}

export interface TSearchDataItem {
  albummid: string;
  singer: { name: string }[];
  songmid: string;
  songname: string;
}

export interface TSearchResponse {
  code: number;
  data: {
    song: {
      list: TSearchDataItem[];
    };
  };
}
