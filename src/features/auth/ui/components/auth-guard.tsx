import type { PropsWithChildren } from "react";
import { useAuthGuard } from "../../app";

export function AuthGuard({ children }: PropsWithChildren) {
	const status = useAuthGuard();

	if (status === "error") return null;
	if (status === "success") return children;

	return null;
}
