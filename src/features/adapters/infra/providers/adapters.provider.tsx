import { useMemo, type PropsWithChildren } from "react";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { StorageAuthAdapter } from "@/features/auth/infra";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider({ children }: PropsWithChildren) {
    const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
    const authAdapter = useMemo(() => new StorageAuthAdapter(storageAdapter), [storageAdapter])

    const allAdapters: IAdapters = {
        authAdapter: authAdapter,
        storageAdapter: storageAdapter,
    }

    return <AdaptersContext.Provider value={allAdapters}>
        {children}
    </AdaptersContext.Provider>
}
