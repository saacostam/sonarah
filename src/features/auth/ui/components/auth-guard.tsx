import type { PropsWithChildren } from "react";
import { LazyLoadedSkeleton } from "@/shared/adapters/navigation/ui";
import { useAuthGuard } from "../../app";

export function AuthGuard({ children }: PropsWithChildren) {
	const status = useAuthGuard();

	if (status === "success") return children;

	return <LazyLoadedSkeleton style={{ height: "100vh" }} />;
}
