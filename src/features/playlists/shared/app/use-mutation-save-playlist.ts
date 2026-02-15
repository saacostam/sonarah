import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export function useMutationSavePlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useClients();

	return useMutation({
		mutationKey: [MutationKey.SAVE_PLAYLIST],
		mutationFn: (args: IPlaylistClientPayload["SaveIn"]) => playlist.save(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
