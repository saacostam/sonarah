import { useEffect, useMemo, useRef, useState } from "react";
import {
	type IStorageAdapter,
	StorageKeys,
} from "@/shared/adapters/storage/domain";
import { type IThemeAdapter, IThemeVariant } from "../domain";

const KEY = StorageKeys.THEME;

async function loadStoredTheme(
	storage: IStorageAdapter,
): Promise<IThemeAdapter["theme"]> {
	if (typeof window === "undefined") return IThemeVariant.LIGHT;
	const saved = await storage.unsafeGet(KEY);
	return saved === IThemeVariant.LIGHT || saved === IThemeVariant.DARK
		? saved
		: IThemeVariant.DARK;
}

function storeTheme(args: {
	storage: IStorageAdapter;
	theme: IThemeAdapter["theme"];
}) {
	const { storage: storageAdapter, theme } = args;

	try {
		storageAdapter.set(KEY, theme);
	} catch {
		// continue
	}
}

export interface UseThemeAdapterImplArgs {
	storage: IStorageAdapter;
}

export function useThemeAdapterImpl({
	storage,
}: UseThemeAdapterImplArgs): IThemeAdapter {
	const loaded = useRef(false);

	const [theme, setTheme] = useState<IThemeAdapter["theme"]>(
		IThemeVariant.DARK,
	);
	useEffect(() => {
		loadStoredTheme(storage)
			.then(setTheme)
			.finally(() => {
				loaded.current = true;
			});
	}, [storage]);

	useEffect(() => {
		if (theme === IThemeVariant.DARK) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	useEffect(() => {
		if (loaded.current) {
			storeTheme({
				theme,
				storage,
			});
		}
	}, [storage, theme]);
	return useMemo(() => ({ theme, setTheme }), [theme]);
}
