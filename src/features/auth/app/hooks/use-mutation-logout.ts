import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/features/async-state/domain";
import { useAdapters } from "@/shared/adapters/app";

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
