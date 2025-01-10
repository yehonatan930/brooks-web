import { atom } from 'jotai';
import { User } from '../types/user';

const loggedInUserAtom = atom<User | null>(null);

export { loggedInUserAtom };
