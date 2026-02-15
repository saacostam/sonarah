import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useMutationPausePlayback() {
	const { webPlayer } = useClients();

	return useMutation({
		mutationKey: [MutationKey.PAUSE_PLAYBACK],
		mutationFn: () => webPlayer.pausePlayback(),
	});
}
