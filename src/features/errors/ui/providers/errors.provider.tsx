import type { PropsWithChildren } from "react";
import { useAdapters } from "@/features/adapters/app";
import { ErrorContext } from "../../app";

export function ErrorsProvider({ children }: PropsWithChildren) {
	const { errorLoggerAdapter } = useAdapters();

	return (
		<ErrorContext.Provider value={errorLoggerAdapter}>
			{children}
		</ErrorContext.Provider>
	);
}
