import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";

export function useMutationStartPlayback() {
	const { webPlayer } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.START_PLAYBACK],
		mutationFn: () => webPlayer.startPlayback(),
	});
}
