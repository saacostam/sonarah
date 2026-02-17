import { useEffect, useMemo } from "react";
import { useLimitedUsersAccessAlertManager } from "@/features/access/limited-users/app";
import { useMutationRequestAccessToken } from "@/features/auth/app";
import { useMutationStartAuthFlow } from "@/shared/adapters/auth/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import type { IAction } from "@/shared/types";

enum UrlSearchParam {
	CODE = "code",
}

export function useHome() {
	const { analyticsAdapter, authAdapter, routerAdapter, navigationAdapter } =
		useAdapters();

	const limitedUsersAccessAlertManager = useLimitedUsersAccessAlertManager();

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
						onClick: () => {
							const onClickLogin = () => {
								analyticsAdapter.trackEvent({
									name: "click-login-button",
									payload: {
										location: "landing",
									},
								});

								startAuthFlow();
							};

							// Show alert if available, else continue
							if (
								limitedUsersAccessAlertManager &&
								limitedUsersAccessAlertManager.status.type === "closed"
							) {
								limitedUsersAccessAlertManager.setStatus({
									type: "open",
									onContinue: onClickLogin,
								});
							} else {
								onClickLogin();
							}
						},
					},
			label: isAuth ? "Start Now" : "Start matching a playlist",
		}),
		[
			analyticsAdapter,
			isAuth,
			limitedUsersAccessAlertManager,
			navigationAdapter,
			startAuthFlow,
		],
	);

	useEffect(() => {
		if (code) {
			requestAccessToken(
				{ code },
				{
					onError: () => {
						analyticsAdapter.trackEvent({
							name: "request-access-token",
							payload: {
								success: false,
							},
						});
					},
					onSuccess: (code) => {
						authAdapter.setToken({ token: code });
						analyticsAdapter.trackEvent({
							name: "request-access-token",
							payload: {
								success: true,
							},
						});
					},
					onSettled: () => routerAdapter.reset(),
				},
			);
		}
	}, [analyticsAdapter, authAdapter, code, requestAccessToken, routerAdapter]);

	return useMemo(
		() =>
			code
				? { status: "loading" as const }
				: { status: "success" as const, mainCta },
		[code, mainCta],
	);
}
