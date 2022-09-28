import { DefaultValue } from 'recoil';

export const localStorageEffect = (key) => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null && savedValue !== undefined) {
        setSelf(JSON.parse(savedValue));
    }

    onSet((newValue) => {
        if (newValue instanceof DefaultValue) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    });
}