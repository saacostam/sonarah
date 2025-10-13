import type { StorageKeys, IStorageAdapter } from "../../domain";

export class LocalStorageAdapter implements IStorageAdapter {
    get(key: StorageKeys): unknown | null {
        const val = localStorage.getItem(key);

        if (val === null) return null;

        try {
            return JSON.parse(val);
        } catch {
            return null;
        }
    };

    set(key: StorageKeys, value: never) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    unsafeGet<T>(key: StorageKeys): T | null {
        const val = this.get(key);

        if (val === null) return null;
        return val as T;
    }
}
