import { useMutation } from "@tanstack/react-query";
import { useAdapters } from "@/shared/adapters/core/app";
import { MutationKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IAuthRepositoryPayload } from "../../domain";

export function useMutationRequestAccessToken() {
	const { auth } = useRepositories();
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.REQUEST_ACCESS_TOKEN],
		mutationFn: async (
			args: IAuthRepositoryPayload["IRequestAccessTokenIn"],
		) => {
			const token = await auth.requestAccessToken(args);
			return authAdapter.setToken({ token });
		},
	});
}
