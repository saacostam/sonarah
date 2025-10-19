import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationKey, QueryKey } from "@/features/async-state/domain";
import { useRepositories } from "@/features/repositories/app";
import type { IPlaylistRepositoryPayload } from "../../domain";

export function useMutationCreatePlaylist() {
	const queryClient = useQueryClient();
	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.CREATE_PLAYLIST],
		mutationFn: (args: IPlaylistRepositoryPayload["CreatePlaylistIn"]) =>
			playlist.create(args),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [QueryKey.MY_PLAYLISTS],
			});
		},
	});
}
