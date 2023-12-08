import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/routers';

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type TSafeSong = RouterOutput['song']['contentSafe'];
export type TSong = RouterOutput['song']['content'];
export type TSongList = RouterOutput['song']['list'];
export type TSafeSongList = RouterOutput['song']['listSafe'];
export type TSongListInfo = RouterOutput['song']['info'];
export type TArrangementList = RouterOutput['arrangement']['list'];
export type TSafeArrangementList = RouterOutput['arrangement']['listSafe'];
export type TArrangement = RouterOutput['arrangement']['content'];
export type TTime = RouterOutput['time']['content'];
export type TTimeList = RouterOutput['time']['list'];

export type TStatus = 'unset' | 'approved' | 'rejected' | 'used';
