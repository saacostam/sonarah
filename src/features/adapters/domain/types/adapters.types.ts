import type { IAuthAdapter } from "@/features/auth/domain";
import type { IStorageAdapter } from "@/features/storage/domain";

export interface IAdapters {
    authAdapter: IAuthAdapter;
    storageAdapter: IStorageAdapter;
}
