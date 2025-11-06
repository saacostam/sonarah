import { useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import {
	useMutationLogout,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/features/auth/app";
import { RouteName } from "@/features/routes/domain";

export function useNavbar() {
	const { routesAdapter } = useAdapters();

	const session = useQuerySession();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: logout } = useMutationLogout();

	return useMemo(
		() => ({
			logoHref:
				session.isSuccess && session.data.type === "authenticated"
					? routesAdapter.generateRoute({ name: RouteName.DASHBOARD })
					: routesAdapter.generateRoute({ name: RouteName.HOME }),
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
		}),
		[
			logout,
			routesAdapter,
			session.data,
			session.isLoading,
			session.isSuccess,
			startAuthFlow,
		],
	);
}
