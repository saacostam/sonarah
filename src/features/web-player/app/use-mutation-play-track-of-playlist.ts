import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IWebPlayerRepositoryPayload } from "../domain";

export function useMutationPlayTrackOfPlaylist() {
	const { webPlayer } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.PLAY_TRACK_OF_PLAYLIST],
		mutationFn: (args: IWebPlayerRepositoryPayload["PlayTrackOfPlaylistIn"]) =>
			webPlayer.playTrackOfPlaylist(args),
	});
}
