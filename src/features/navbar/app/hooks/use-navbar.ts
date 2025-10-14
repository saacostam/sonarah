import { useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { useQuerySession } from "@/features/auth/app";
import { RouteName } from "@/features/router/domain";

export function useNavbar() {
	const { routerAdapter } = useAdapters();
	const session = useQuerySession();

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
												type: "href" as const,
												href: routerAdapter.generateRoute({
													name: RouteName.LOGIN,
												}),
											},
										}
									: {
											label: "Start",
											action: {
												type: "href" as const,
												href: routerAdapter.generateRoute({
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
												href: routerAdapter.generateRoute({
													name: RouteName.LOGIN,
												}),
											},
										}
									: null,
						}
					: {
							status: "error" as const,
						},
		[routerAdapter, session.data, session.isLoading, session.isSuccess],
	);
}
