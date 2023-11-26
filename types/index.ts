import type { TRawSong } from "~/server/db/db";
import type { AppRouter } from '~/server/trpc/routers'
import type { inferRouterOutputs } from '@trpc/server';

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type TSafeSong = RouterOutput['song']['contentSafe'];
export type TSong = RouterOutput['song']['content'];
export type TSongList = RouterOutput['song']['list'];
export type TSafeSongList = RouterOutput['song']['listSafe'];
export type TArrangementList = RouterOutput['arrangement']['list'];
