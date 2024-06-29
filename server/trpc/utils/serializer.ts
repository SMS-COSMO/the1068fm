import type { TRawSong } from '~/server/db/db';

// this type should be ONLY used in server
export type TSerializedSong = Omit<TRawSong, 'submitterName'
  | 'submitterGrade'
  | 'submitterClass'
  | 'message'
  | 'status'
  | 'type'>
  & { message: boolean };

export function serializeSong(song: TRawSong): TSerializedSong {
  const { submitterClass, submitterName, submitterGrade, message, status, type, ...safePartWithoutMsg } = song;
  return { message: !!message, ...safePartWithoutMsg };
}
