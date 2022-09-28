import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

export const gameIDAtom = atom({
    key: 'gameIDAtom',
    default: null,
    effects_UNSTABLE: [localStorageEffect('gameID')]
})

