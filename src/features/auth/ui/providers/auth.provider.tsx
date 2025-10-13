import { useMemo, type PropsWithChildren } from "react";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { AuthContext } from "../../app";
import { StorageAuthAdapter } from "../../infra";

export function AuthProvider({
    children
}: PropsWithChildren) {
    const storageAuthAdapter = useMemo(() => (new StorageAuthAdapter(
        new LocalStorageAdapter(),
    )), [])

    return (
        <AuthContext.Provider value={storageAuthAdapter}>
            {children}
        </AuthContext.Provider>
    )
}
