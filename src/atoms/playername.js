import { atom } from 'recoil';
import { localStorageEffect } from './localStorageEffect';

export const playerNameAtom = atom({
    key: 'playerNameAtom',
    default: "",
    effects_UNSTABLE: [localStorageEffect('playerName')]
})