import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IAuthClientPayload } from "../../domain";

export function useMutationRequestAccessToken() {
	const { auth } = useClients();

	return useMutation({
		mutationKey: [MutationKey.REQUEST_ACCESS_TOKEN],
		mutationFn: async (args: IAuthClientPayload["IRequestAccessTokenIn"]) =>
			auth.requestAccessToken(args),
	});
}
