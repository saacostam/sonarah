import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationCreatePlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.CREATE_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["CreatePlaylistIn"]) =>
			playlist.create(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
