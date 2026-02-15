import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutationTransferPlayback() {
	const { webPlayer } = useClients();

	return useMutation({
		mutationKey: [MutationKey.TRANSFER_PLAYBACK],
		mutationFn: webPlayer.transferPlayback.bind(webPlayer),
	});
}
