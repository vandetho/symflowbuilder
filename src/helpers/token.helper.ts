import * as crypto from 'crypto';

export type TokenHelperOptions = {
    size?: number;
    majuscule?: boolean;
    minuscule?: boolean;
    numeric?: boolean;
    symbol?: boolean;
};

export class TokenHelper {
    static generateToken(tokenHelperOptions: TokenHelperOptions = {}) {
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
        const charactersLength = characters.length;
        let result = '';

        // Create an array of 32-bit unsigned integers
        const randomValues = new Uint32Array(size);

        // Generate random values
        crypto.getRandomValues(randomValues);
        randomValues.forEach((value) => {
            result += characters.charAt(value % charactersLength);
        });
        return result;
    }
}
