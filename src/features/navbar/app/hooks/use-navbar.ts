import { useCallback, useMemo } from "react";
import {
	useMutationLogout,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/shared/adapters/auth/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { IThemeVariant } from "@/shared/adapters/theme/domain";

export function useNavbar() {
	const { navigationAdapter, themeAdapter } = useAdapters();

	const session = useQuerySession();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: logout } = useMutationLogout();

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
				session.isSuccess && session.data.type === "authenticated"
					? navigationAdapter.generateRoute({ name: RouteName.DASHBOARD })
					: navigationAdapter.generateRoute({ name: RouteName.HOME }),
			loader: session.isLoading
				? {
						status: "loading" as const,
					}
				: session.isSuccess
					? {
							status: "success" as const,
							mainAction:
								session.data.type === "unauthenticated"
									? {
											label: "Login",
											action: {
												type: "button" as const,
												onClick: () => startAuthFlow(),
											},
										}
									: {
											label: "Sign Out",
											action: {
												type: "button" as const,
												onClick: () => logout(),
											},
										},
						}
					: {
							status: "error" as const,
						},
			onToggleTheme,
			theme: themeAdapter.theme,
		}),
		[
			logout,
			navigationAdapter,
			onToggleTheme,
			session.data,
			session.isLoading,
			session.isSuccess,
			startAuthFlow,
			themeAdapter.theme,
		],
	);
}
