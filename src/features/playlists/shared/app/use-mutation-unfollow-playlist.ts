import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationUnfollowPlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.UNFOLLOW_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["UnfollowIn"]) =>
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
