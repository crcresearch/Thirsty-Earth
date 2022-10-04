import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

export const playerIDAtom = atom({
    key: 'playerIDAtom',
    default: '0',
    effects_UNSTABLE: [localStorageEffect('playerID')]
})
