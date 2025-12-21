import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IWebPlayerRepositoryPayload } from "../domain";

export function useMutationSeekToPosition() {
	const { webPlayer } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.SEEK_TO_POSITION],
		mutationFn: (args: IWebPlayerRepositoryPayload["SeekToPositionIn"]) =>
			webPlayer.seekToPosition(args),
	});
}
