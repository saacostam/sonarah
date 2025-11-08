import { useCallback } from "react";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { useMutationAddItemToPlaylist } from "../../hooks";
import { CreatePlaylist } from "../create-playlist";

export interface CreateMatchedPlaylistProps {
	onClose: () => void;
	onError: (e: unknown) => void;
	onSuccess: () => void;
	tracksUris: string[];
}

export function CreateMatchedPlaylist({
	onClose,
	onError,
	onSuccess,
	tracksUris,
}: CreateMatchedPlaylistProps) {
	const { mutate: addItemToPlaylistMutate } = useMutationAddItemToPlaylist();

	const onCreatePlaylistSuccess = useCallback(
		(args: IPlaylistRepositoryPayload["CreatePlaylistOut"]) => {
			const { id } = args;

			addItemToPlaylistMutate(
				{ id, uris: tracksUris },
				{
					onSuccess: onSuccess,
					onError: onError,
					onSettled: onClose,
				},
			);
		},
		[addItemToPlaylistMutate, onClose, onError, onSuccess, tracksUris],
	);

	return (
		<CreatePlaylist onCancel={onClose} onSuccess={onCreatePlaylistSuccess} />
	);
}
