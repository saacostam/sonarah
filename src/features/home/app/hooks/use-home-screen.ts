import { useEffect, useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import {
	useMutationRequestAccessToken,
	useMutationSetSession,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/features/auth/app";
import { RouteName } from "@/features/router/domain";
import type { IButtonAction } from "@/shared/types";

enum UrlSearchParam {
	CODE = "code",
}

export function useHomeScreen() {
	const { routerAdapter } = useAdapters();
	const session = useQuerySession();

	const { mutate: setSession } = useMutationSetSession();
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
						href: routerAdapter.generateRoute({ name: RouteName.DASHBOARD }),
					}
				: {
						type: "button",
						onClick: () => startAuthFlow(),
					},
			label: isAuth ? "Start Now" : "Login",
		}),
		[isAuth, routerAdapter, startAuthFlow],
	);

	useEffect(() => {
		if (code) {
			const reset = () => routerAdapter.replace(routerAdapter.getPathname());

			requestAccessToken(
				{ code },
				{
					onSuccess: (token) => {
						setSession(
							{ token },
							{
								onSettled: () => routerAdapter.reset(),
							},
						);
					},
					onError: (e) => {
						console.error(e);
						reset();
					},
				},
			);
		}
	}, [code, requestAccessToken, routerAdapter, setSession]);

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
