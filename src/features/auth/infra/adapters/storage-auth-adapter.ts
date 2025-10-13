import { StorageKeys, type IStorageAdapter } from "@/features/storage/domain";
import type { IAuthAdapter, ISession } from "../../domain";

export class StorageAuthAdapter implements IAuthAdapter {
    constructor(
        private clientStorageAdapter: IStorageAdapter
    ) {}

    async getSession(): Promise<ISession> {
        const _token = this.clientStorageAdapter.get(StorageKeys.TOKEN);

        const token = typeof _token === "string" && _token.trim().length > 0 ? _token : null;

        return token ? {
            type: "authenticated",
            token,
        } : {
            type: "unauthenticated",
        }
    }
}
