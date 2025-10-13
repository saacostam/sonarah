import { useMemo } from "react";
import { useQuerySession } from "@/features/auth/app";

export function useNavbar() {
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
											label: "Signin",
											action: { type: "href" as const, href: "#" },
										}
									: {
											label: "Start",
											action: { type: "href" as const, href: "#" },
										},
							secondaryAction:
								session.data.type === "authenticated"
									? {
											label: "Sign Out",
											action: { type: "href" as const, href: "#" },
										}
									: null,
						}
					: {
							status: "error" as const,
						},
		[session.data, session.isLoading, session.isSuccess],
	);
}
