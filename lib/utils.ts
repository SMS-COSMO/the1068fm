import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AppRouter } from '~/server/trpc/routers'
import type { inferRouterOutputs } from '@trpc/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type TSong = RouterOutput['song']['content'];
export type TSongList = RouterOutput['song']['list'];
export type TArrangementList = RouterOutput['arrangement']['list'];
