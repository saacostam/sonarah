import { useMutation } from "@tanstack/react-query";
import { useAdapters } from "@/shared/adapters/core/app";
import { MutationKey } from "@/shared/async-state/domain";
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
