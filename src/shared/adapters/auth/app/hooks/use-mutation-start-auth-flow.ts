import { useMutation } from "@tanstack/react-query";
import { useAdapters } from "@/shared/adapters/core/app";
import { MutationKey } from "@/shared/async-state";

export function useMutationStartAuthFlow() {
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.START_AUTH_FLOW],
		mutationFn: () => authAdapter.startAuthFlow(),
	});
}
