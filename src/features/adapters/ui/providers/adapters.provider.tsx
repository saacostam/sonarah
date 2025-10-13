import { useMemo, type PropsWithChildren } from "react";
import { StorageAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { LocalStorageAdapter } from "@/features/storage/infra";
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
        <AuthProvider>
            {children}
        </AuthProvider>
    </AdaptersContext.Provider>
}
