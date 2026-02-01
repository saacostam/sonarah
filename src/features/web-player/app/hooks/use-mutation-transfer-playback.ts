import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useRepositories } from "@/shared/repositories/app";

export function useMutationTransferPlayback() {
	const { webPlayer } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.TRANSFER_PLAYBACK],
		mutationFn: webPlayer.transferPlayback.bind(webPlayer),
	});
}
