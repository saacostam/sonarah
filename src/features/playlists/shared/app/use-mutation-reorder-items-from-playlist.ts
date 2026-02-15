import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationReorderItemsFromPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.REORDER_ITEMS_FROM_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["ReorderItemsFromPlaylistIn"]) =>
			playlist.reorderItemsFromPlaylist(args),
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
