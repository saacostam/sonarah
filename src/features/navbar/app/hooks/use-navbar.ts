import { useCallback, useMemo } from "react";
import { useLimitedUsersAccessAlertManager } from "@/features/access/limited-users/app";
import { useMutationStartAuthFlow } from "@/shared/adapters/auth/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { IThemeVariant } from "@/shared/adapters/theme/domain";

export function useNavbar() {
	const {
		analyticsAdapter,
		authAdapter,
		navigationAdapter,
		routerAdapter,
		themeAdapter,
	} = useAdapters();

	const limitedUsersAccessAlertManager = useLimitedUsersAccessAlertManager();

	const session = authAdapter.getToken();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();

	const logout = useCallback(() => {
		authAdapter.removeToken();
		routerAdapter.push(
			navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
		);
	}, [authAdapter, navigationAdapter, routerAdapter]);

	const onToggleTheme = useCallback(() => {
		themeAdapter.setTheme(
			themeAdapter.theme === IThemeVariant.DARK
				? IThemeVariant.LIGHT
				: IThemeVariant.DARK,
		);
	}, [themeAdapter]);

	return useMemo(
		() => ({
			logoHref:
				session.type === "authenticated"
					? navigationAdapter.generateRoute({ name: RouteName.DASHBOARD })
					: navigationAdapter.generateRoute({ name: RouteName.HOME }),
			mainAction:
				session.type === "unauthenticated"
					? {
							label: "Login",
							action: {
								type: "button" as const,
								onClick: () => {
									const onClickLogin = () => {
										analyticsAdapter.trackEvent({
											name: "click-login-button",
											payload: {
												location: "navbar",
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
						}
					: {
							label: "Sign Out",
							action: {
								type: "button" as const,
								onClick: () => logout(),
							},
						},
			onToggleTheme,
			theme: themeAdapter.theme,
		}),
		[
			analyticsAdapter,
			limitedUsersAccessAlertManager,
			logout,
			navigationAdapter,
			onToggleTheme,
			session.type,
			startAuthFlow,
			themeAdapter.theme,
		],
	);
}
