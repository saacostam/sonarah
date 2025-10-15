import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdapters } from "@/features/adapters/app";
import { MutationKey, QueryKey } from "@/features/async-state/domain";

export function useMutationLogout() {
	const queryClient = useQueryClient();

	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.LOGOUT],
		mutationFn: () => authAdapter.removeSession(),
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: [QueryKey.SESSION],
			}),
	});
}
