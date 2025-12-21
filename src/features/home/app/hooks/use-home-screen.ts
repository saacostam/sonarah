import { useEffect, useMemo } from "react";
import {
	useMutationRequestAccessToken,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/features/auth/app";
import { RouteName } from "@/features/navigation/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import type { IButtonAction } from "@/shared/types";

enum UrlSearchParam {
	CODE = "code",
}

export function useHomeScreen() {
	const { routerAdapter, navigationAdapter } = useAdapters();
	const session = useQuerySession();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: requestAccessToken } = useMutationRequestAccessToken();

	const urlSearchParams = routerAdapter.getUrlSearchParams();
	const code = urlSearchParams.get(UrlSearchParam.CODE);

	const isAuth = session.isSuccess && session.data.type === "authenticated";
	const mainCta: IButtonAction = useMemo(
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
					// We rely on the authentication logic to re-direct to auth pages
					onSettled: () => routerAdapter.reset(),
				},
			);
		}
	}, [code, requestAccessToken, routerAdapter]);

	return useMemo(
		() =>
			code || session.isLoading
				? { status: "loading" as const }
				: session.isSuccess
					? { status: "success" as const, mainCta }
					: { status: "error" as const },
		[code, mainCta, session.isLoading, session.isSuccess],
	);
}
