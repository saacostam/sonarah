import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationRemoveItemsFromPlaylist() {
	const queryClient = useQueryClient();

	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.REMOVE_ITEMS_FROM_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["RemoveItemsFromPlaylistIn"]) =>
			playlist.removeItemsFromPlaylist(args),
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
