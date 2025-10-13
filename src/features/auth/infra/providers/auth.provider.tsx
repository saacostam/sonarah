import { useMemo, type PropsWithChildren } from "react";
import { AuthContext } from "../../app/context";
import { StorageAuthAdapter } from "../adapters";
import { LocalStorageAdapter } from "@/features/storage/infra";

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
