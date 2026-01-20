import type { IStorageAdapter, StorageKeys } from "../../domain";

export class LocalStorageAdapter implements IStorageAdapter {
	get(key: StorageKeys): unknown | null {
		const val = localStorage.getItem(key);

		if (val === null) return null;

		try {
			return JSON.parse(val);
		} catch {
			return null;
		}
	}

	remove(key: StorageKeys) {
		localStorage.removeItem(key);
	}

	set(key: StorageKeys, value: unknown) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	unsafeGet<T>(key: StorageKeys): T | null {
		const val = this.get(key);

		if (val === null) return null;
		return val as T;
	}
}
