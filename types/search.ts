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
  pic?: string;
}

export interface TSearchDataItem {
  count: number;
  itemlist: TItem[];
  name: string;
  order: number;
  type: number;
}

export interface TSearchResponse {
  code: number;
  data: {
    album: TSearchDataItem;
    mv: TSearchDataItem;
    singer: TSearchDataItem;
    song: TSearchDataItem;
  };
  subcode: number;
}
