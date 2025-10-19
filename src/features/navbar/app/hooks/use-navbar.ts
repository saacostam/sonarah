import { useMemo } from "react";
import {
	useMutationLogout,
	useMutationStartAuthFlow,
	useQuerySession,
} from "@/features/auth/app";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";

export function useNavbar() {
	const router = useRouter();

	const session = useQuerySession();

	const { mutate: startAuthFlow } = useMutationStartAuthFlow();
	const { mutate: logout } = useMutationLogout();

	return useMemo(
		() => ({
			logoHref:
				session.isSuccess && session.data.type === "authenticated"
					? router.generateRoute({ name: RouteName.DASHBOARD })
					: router.generateRoute({ name: RouteName.HOME }),
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
			router,
			session.data,
			session.isLoading,
			session.isSuccess,
			startAuthFlow,
		],
	);
}
