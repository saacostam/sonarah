import { useMutation } from "@tanstack/react-query";
import { useAdapters } from "@/features/adapters/app";
import { MutationKey } from "@/features/async-state/domain";
import type { IAuthAdapterPayload } from "../../domain";

export function useMutationRequestAccessToken() {
	const { authAdapter } = useAdapters();

	return useMutation({
		mutationKey: [MutationKey.REQUEST_ACCESS_TOKEN],
		mutationFn: (args: IAuthAdapterPayload["IRequestAccessTokenIn"]) =>
			authAdapter.requestAccessToken(args),
	});
}
