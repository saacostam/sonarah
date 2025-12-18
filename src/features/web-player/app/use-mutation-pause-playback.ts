import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";

export function useMutationPausePlayback() {
	const { webPlayer } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.PAUSE_PLAYBACK],
		mutationFn: () => webPlayer.pausePlayback(),
	});
}
