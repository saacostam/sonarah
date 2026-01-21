import type { StorageKeys } from "../entities";

export interface IStorageAdapter {
	get: (key: StorageKeys) => unknown | null;
	remove: (key: StorageKeys) => void;
	unsafeGet: <T>(key: StorageKeys) => T | null;
	set: (key: StorageKeys, value: unknown) => void;
}
