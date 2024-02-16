import { customAlphabet } from 'nanoid';

export type TokenHelperOptions = {
    size?: number;
    majuscule?: boolean;
    minuscule?: boolean;
    numeric?: boolean;
    symbol?: boolean;
};

export function generateToken(tokenHelperOptions: TokenHelperOptions = {}) {
    const { size = 16, majuscule = true, minuscule = true, numeric = true, symbol = false } = tokenHelperOptions;
    let characters = '';
    if (majuscule) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (minuscule) {
        characters += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (numeric) {
        characters += '0123456789';
    }
    if (symbol) {
        characters += '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    }
    const nanoid = customAlphabet(characters, size);
    return nanoid();
}
