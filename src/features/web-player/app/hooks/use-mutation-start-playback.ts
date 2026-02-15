import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutationStartPlayback() {
	const { webPlayer } = useClients();

	return useMutation({
		mutationKey: [MutationKey.START_PLAYBACK],
		mutationFn: () => webPlayer.startPlayback(),
	});
}
