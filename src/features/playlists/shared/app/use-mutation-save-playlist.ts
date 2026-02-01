import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/shared/async-state";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export function useMutationSavePlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.SAVE_PLAYLIST],
		mutationFn: (args: IPlaylistRepositoryPayload["SaveIn"]) =>
			playlist.save(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
