import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import type { IRouterAdapter } from "../../domain";

export function useReactRouterAdapter(): IRouterAdapter {
	const location = useLocation();
	const navigate = useNavigate();

	const getBaseUrl: IRouterAdapter["getBaseUrl"] = useCallback(
		() => window.location.origin,
		[],
	);

	const getPathname: IRouterAdapter["getPathname"] = useCallback(
		() => location.pathname,
		[location.pathname],
	);

	const getParams: IRouterAdapter["getParams"] = useParams;

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
		window.location.href = window.location.origin;
	}, []);

	return useMemo(
		(): IRouterAdapter => ({
			getBaseUrl,
			getPathname,
			getParams,
			getUrlSearchParams,
			push,
			replace,
			reset,
		}),
		[
			getBaseUrl,
			getPathname,
			getParams,
			getUrlSearchParams,
			push,
			replace,
			reset,
		],
	);
}
