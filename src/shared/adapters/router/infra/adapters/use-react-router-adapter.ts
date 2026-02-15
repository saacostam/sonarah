import { useCallback, useMemo } from "react";
import {
	useLocation,
	useNavigate,
	useParams as useReactRouterParams,
} from "react-router";
import type { IRouterAdapter } from "../../domain";

export interface UseReactRouterAdapterArgs {
	baseUrl: string | null;
}

export function useReactRouterAdapter({
	baseUrl: _baseUrl,
}: UseReactRouterAdapterArgs): IRouterAdapter {
	const baseUrl: string = useMemo(() => {
		// Default to window.location.origin if not available or invalid
		if (!_baseUrl) return window.location.origin;

		try {
			const url = new URL(_baseUrl);
			return url.toString();
		} catch {
			return window.location.origin;
		}
	}, [_baseUrl]);

	const location = useLocation();
	const navigate = useNavigate();

	const getBaseUrl: IRouterAdapter["getBaseUrl"] = useCallback(
		() => baseUrl,
		[baseUrl],
	);

	const getPathname: IRouterAdapter["getPathname"] = useCallback(
		() => location.pathname,
		[location.pathname],
	);

	const useParams: IRouterAdapter["useParams"] = useReactRouterParams;

	const getUrlSearchParams: IRouterAdapter["getUrlSearchParams"] = useCallback(
		() => new URLSearchParams(window.location.search),
		[],
	);

	const push: IRouterAdapter["push"] = useCallback(
		async (route) => {
			navigate(route);
		},
		[navigate],
	);

	const replace: IRouterAdapter["replace"] = useCallback(
		async (route) => {
			navigate(route, { replace: true });
		},
		[navigate],
	);

	const reset: IRouterAdapter["reset"] = useCallback(async () => {
		window.location.href = getBaseUrl();
	}, [getBaseUrl]);

	return useMemo(
		(): IRouterAdapter => ({
			getBaseUrl,
			getPathname,
			useParams,
			getUrlSearchParams,
			push,
			replace,
			reset,
		}),
		[
			getBaseUrl,
			getPathname,
			useParams,
			getUrlSearchParams,
			push,
			replace,
			reset,
		],
	);
}
