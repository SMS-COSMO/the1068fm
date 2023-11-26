import { type TRawSong } from "~/server/db/db";

export type TSong = Omit<TRawSong, 'submitterName' | 'submitterGrade' | 'submitterClass' | 'message'> & { message: boolean }

export function serializeSong(song: TRawSong): TSong {
    const { submitterClass, submitterName, submitterGrade, message, ...safePartWithoutMsg } = song
    return { message: message ? true : false, ...safePartWithoutMsg }
}