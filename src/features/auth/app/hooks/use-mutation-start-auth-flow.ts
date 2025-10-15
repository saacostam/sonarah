import { useMutation } from "@tanstack/react-query";
import { useAdapters } from "@/features/adapters/app";
import { MutationKey } from "@/features/async-state/domain";

export function useMutationStartAuthFlow() {
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.START_AUTH_FLOW],
		mutationFn: () => authAdapter.startAuthFlow(),
	});
}
