import { nanoid } from 'nanoid'
export const useNanoID = () => {
    return nanoid(8)
}