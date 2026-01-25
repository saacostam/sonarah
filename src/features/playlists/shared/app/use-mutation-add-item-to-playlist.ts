import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export function useMutationAddItemToPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.ADD_ITEM_TO_PLAYLIST],
		mutationFn: (args: IPlaylistRepositoryPayload["AddItemsToPlaylistIn"]) =>
			playlist.addItems(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.PLAYLIST_BY_ID],
			});

			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
