import type { IStorageAdapter, StorageKeys } from "../../domain";

export class LocalStorageAdapter implements IStorageAdapter {
	async get(key: StorageKeys): Promise<unknown | null> {
		const val = localStorage.getItem(key);

		if (val === null) return null;

		try {
			return JSON.parse(val);
		} catch {
			return null;
		}
	}

	async set(key: StorageKeys, value: unknown) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	async unsafeGet<T>(key: StorageKeys): Promise<T | null> {
		const val = this.get(key);

		if (val === null) return null;
		return val as T;
	}
}
