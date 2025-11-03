import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/features/async-state/domain";
import { useRepositories } from "@/features/repositories/app";
import type { IPlaylistRepositoryPayload } from "../../domain";

export function useMutationAddItemToPlaylist() {
	const { playlist } = useRepositories();

	return useMutation({
		mutationKey: [MutationKey.ADD_ITEM_TO_PLAYLIST],
		mutationFn: (args: IPlaylistRepositoryPayload["AddItemsToPlaylistIn"]) =>
			playlist.addItems(args),
	});
}
