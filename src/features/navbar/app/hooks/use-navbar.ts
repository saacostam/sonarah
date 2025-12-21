import { useMemo } from "react";
import {
	useMutationLogout,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/features/auth/app";
import { RouteName } from "@/features/navigation/domain";
import { useAdapters } from "@/shared/adapters/core/app";

export function useNavbar() {
	const { navigationAdapter } = useAdapters();

	const session = useQuerySession();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: logout } = useMutationLogout();

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
		}),
		[
			logout,
			navigationAdapter,
			session.data,
			session.isLoading,
			session.isSuccess,
			startAuthFlow,
		],
	);
}
