import { nanoid } from 'nanoid';

export function useNanoID() {
  return nanoid(8);
}
