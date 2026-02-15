import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationAddItemToPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.ADD_ITEM_TO_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["AddItemsToPlaylistIn"]) =>
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
