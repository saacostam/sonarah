import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useAdapters } from "@/shared/adapters/app";
import type { IAuthAdapterPayload } from "../../domain";

export function useMutationRequestAccessToken() {
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.REQUEST_ACCESS_TOKEN],
		mutationFn: async (args: IAuthAdapterPayload["IRequestAccessTokenIn"]) => {
			const token = await authAdapter.requestAccessToken(args);
			return authAdapter.setToken({ token });
		},
	});
}
