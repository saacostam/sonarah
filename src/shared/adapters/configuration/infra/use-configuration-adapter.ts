import { useCallback, useMemo } from "react";
import {
	type IConfigurationAdapter,
	IConfigurationAdapterStringKey,
} from "../domain";

export function useConfigurationAdapter(): IConfigurationAdapter {
	const getString: IConfigurationAdapter["getString"] = useCallback((key) => {
		switch (key) {
			case IConfigurationAdapterStringKey.BASE_URL: {
				return import.meta.env.VITE_BASE_URL ?? null;
			}
		}
	}, []);

	return useMemo(
		() => ({
			getString,
		}),
		[getString],
	);
}
