import { atom } from 'recoil';
import { localStorageEffect }  from './localStorageEffect';

export const playerCredentialsAtom = atom({
    key: 'playerCredentialsAtom',
    default: null,
    effects_UNSTABLE: [localStorageEffect('playerCredentials')]
})