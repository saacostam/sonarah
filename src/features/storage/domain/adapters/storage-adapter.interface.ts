import type { StorageKeys } from "../entities";

export interface IStorageAdapter {
	get: (key: StorageKeys) => Promise<unknown | null>;
	unsafeGet: <T>(key: StorageKeys) => Promise<T | null>;
	set: (key: StorageKeys, value: never) => Promise<void>;
}
