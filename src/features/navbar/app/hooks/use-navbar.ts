import { useMemo } from "react";
import { useMutationStartAuthFlow, useQuerySession } from "@/features/auth/app";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";

export function useNavbar() {
	const router = useRouter();
	const session = useQuerySession();
	const startAuthFlow = useMutationStartAuthFlow();

	return useMemo(
		() =>
			session.isLoading
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
												onClick: () => startAuthFlow.mutate(),
											},
										}
									: {
											label: "Start",
											action: {
												type: "href" as const,
												href: router.generateRoute({
													name: RouteName.DASHBOARD,
												}),
											},
										},
							secondaryAction:
								session.data.type === "authenticated"
									? {
											label: "Sign Out",
											action: {
												type: "href" as const,
												href: router.generateRoute({
													name: RouteName.HOME,
												}),
											},
										}
									: null,
						}
					: {
							status: "error" as const,
						},
		[router, session.data, session.isLoading, session.isSuccess, startAuthFlow],
	);
}
