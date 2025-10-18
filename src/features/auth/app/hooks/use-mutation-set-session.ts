import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdapters } from "@/features/adapters/app";
import { MutationKey, QueryKey } from "@/features/async-state/domain";
import type { IAuthAdapterPayload } from "../../domain";

export function useMutationSetSession() {
	const queryClient = useQueryClient();
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.SET_SESSION],
		mutationFn: (args: IAuthAdapterPayload["ISetTokenIn"]) =>
			authAdapter.setToken(args),
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: [QueryKey.SESSION],
			}),
	});
}
