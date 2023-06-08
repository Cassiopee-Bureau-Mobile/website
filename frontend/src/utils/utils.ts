import sha256 from 'crypto-js/sha256';

export function getFirstValue<T extends object, F>(obj: T): F | undefined {
    const firstKey = Object.keys(obj)[0];
    if (firstKey === undefined) {
        return undefined;
    } else {
        return obj[firstKey as keyof T] as F;
    }
}

export class NotFoundError extends Error {}

export function hashPassword(password: string): string {
    return sha256(password).toString();
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}

export function extractHostLine(file: string[], type: Type): number {
    let lineToModify = -1;
    for (let i = 0; i < file.length; i++) {
        if (file[i] === `[${type.toLocaleLowerCase()}]`) {
            lineToModify = i + 1;
            break;
        }
    }
    if (lineToModify === -1) {
        throw new Error(`Could not find [${type}] in hosts file`);
    }
    return lineToModify;
}
