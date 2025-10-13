import type { PropsWithChildren } from "react";
import { useAdapters } from "@/features/adapters/app";
import { AuthContext } from "../../app";
import { AuthGuard } from "../components";

export function AuthProvider({ children }: PropsWithChildren) {
	const { authAdapter } = useAdapters();

	return (
		<AuthContext.Provider value={authAdapter}>
			<AuthGuard>{children}</AuthGuard>
		</AuthContext.Provider>
	);
}
