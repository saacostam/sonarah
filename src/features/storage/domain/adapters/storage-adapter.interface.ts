import type { StorageKeys } from "../entities";

export interface IStorageAdapter {
    get: (key: StorageKeys) => unknown | null;
    unsafeGet: <T>(key: StorageKeys) => T | null;
    set: (key: StorageKeys, value: never) => void;
}
