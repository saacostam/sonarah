import { useEffect, useMemo } from "react";
import { useMutationRequestAccessToken } from "@/features/auth/app";
import { useMutationStartAuthFlow } from "@/shared/adapters/auth/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import type { IAction } from "@/shared/types";

enum UrlSearchParam {
	CODE = "code",
}

export function useHome() {
	const { authAdapter, routerAdapter, navigationAdapter } = useAdapters();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: requestAccessToken } = useMutationRequestAccessToken();

	const urlSearchParams = routerAdapter.getUrlSearchParams();
	const code = urlSearchParams.get(UrlSearchParam.CODE);

	const session = authAdapter.getToken();
	const isAuth = session.type === "authenticated";
	const mainCta: IAction = useMemo(
		() => ({
			action: isAuth
				? {
						type: "href",
						href: navigationAdapter.generateRoute({
							name: RouteName.DASHBOARD,
						}),
					}
				: {
						type: "button",
						onClick: () => startAuthFlow(),
					},
			label: isAuth ? "Start Now" : "Login",
		}),
		[isAuth, navigationAdapter, startAuthFlow],
	);

	useEffect(() => {
		if (code) {
			requestAccessToken(
				{ code },
				{
					onSuccess: (code) => {
						authAdapter.setToken({ token: code });
					},
					onSettled: () => routerAdapter.reset(),
				},
			);
		}
	}, [authAdapter, code, requestAccessToken, routerAdapter]);

	return useMemo(
		() =>
			code
				? { status: "loading" as const }
				: { status: "success" as const, mainCta },
		[code, mainCta],
	);
}
