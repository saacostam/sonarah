import type { StorageKeys } from "../entities";

export interface IStorageAdapter {
	get: (key: StorageKeys) => Promise<unknown | null>;
	remove: (key: StorageKeys) => Promise<void>;
	unsafeGet: <T>(key: StorageKeys) => Promise<T | null>;
	set: (key: StorageKeys, value: unknown) => Promise<void>;
}
