import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export function useMutationUnfollowPlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.UNFOLLOW_PLAYLIST],
		mutationFn: (args: IPlaylistRepositoryPayload["UnfollowIn"]) =>
			playlist.unfollow(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QueryKey.PLAYLIST_BY_ID],
			});
		},
	});
}
