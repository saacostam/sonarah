import type { PropsWithChildren } from "react";
import { useAuthGuard } from "../../app";
import { AuthGuardSkeleton } from "./auth-guard-skeleton";

export function AuthGuard({ children }: PropsWithChildren) {
	const status = useAuthGuard();

	if (status === "error") return <AuthGuardSkeleton />;
	if (status === "success") return children;

	return <AuthGuardSkeleton />;
}
