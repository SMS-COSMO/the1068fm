import { defineStore } from 'pinia';

export const useSongStore = defineStore('song', () => {
    const mySongs = ref<string[]>([]);

    const submitSong = (songId: string) => {
        mySongs.value.push(songId);
    };

    const isMySong = (songId: string) => {
        return mySongs.value.indexOf(songId) !== -1;
    };

    return {
        mySongs,
        submitSong,
        isMySong,
    };
}, {
    persist: true,
});
