import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useRepositories } from "@/shared/repositories/app";
import type { IAuthRepositoryPayload } from "../../domain";

export function useMutationRequestAccessToken() {
	const { auth } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.REQUEST_ACCESS_TOKEN],
		mutationFn: async (args: IAuthRepositoryPayload["IRequestAccessTokenIn"]) =>
			auth.requestAccessToken(args),
	});
}
