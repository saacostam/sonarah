import type { PropsWithChildren } from "react";
import { useAdapters } from "@/features/adapters/app";
import { AuthContext } from "../../app";

export function AuthProvider({ children }: PropsWithChildren) {
	const { authAdapter } = useAdapters();

	return (
		<AuthContext.Provider value={authAdapter}>{children}</AuthContext.Provider>
	);
}
