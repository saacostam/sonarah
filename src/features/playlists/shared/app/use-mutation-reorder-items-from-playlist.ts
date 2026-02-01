import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export function useMutationReorderItemsFromPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.REORDER_ITEMS_FROM_PLAYLIST],
		mutationFn: (
			args: IPlaylistRepositoryPayload["ReorderItemsFromPlaylistIn"],
		) => playlist.reorderItemsFromPlaylist(args),
		onSettled: (_, __, vars) => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.PLAYLIST_BY_ID, vars.playlistId],
			});

			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
