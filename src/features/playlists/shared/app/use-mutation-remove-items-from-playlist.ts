import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export function useMutationRemoveItemsFromPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.REMOVE_ITEMS_FROM_PLAYLIST],
		mutationFn: (
			args: IPlaylistRepositoryPayload["RemoveItemsFromPlaylistIn"],
		) => playlist.removeItemsFromPlaylist(args),
		onSettled: (_, __, vars) => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.PLAYLIST_BY_ID, vars.id],
			});

			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
