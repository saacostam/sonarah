import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useAdapters } from "@/shared/adapters/app";

export function useMutationStartAuthFlow() {
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.START_AUTH_FLOW],
		mutationFn: () => authAdapter.startAuthFlow(),
	});
}
