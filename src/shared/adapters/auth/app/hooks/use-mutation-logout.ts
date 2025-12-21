import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdapters } from "@/shared/adapters/core/app";
import { MutationKey, QueryKey } from "@/shared/async-state/domain";

export function useMutationLogout() {
	const queryClient = useQueryClient();

	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.LOGOUT],
		mutationFn: () => authAdapter.removeToken(),
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: [QueryKey.SESSION],
			}),
	});
}
