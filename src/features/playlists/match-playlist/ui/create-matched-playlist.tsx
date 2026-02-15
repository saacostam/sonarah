import { useCallback } from "react";
import { CreatePlaylist } from "@/features/playlists/create-playlist/ui";
import { useMutationAddItemToPlaylist } from "@/features/playlists/shared/app";
import type { IPlaylistClientPayload } from "@/features/playlists/shared/domain";

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
		(args: IPlaylistClientPayload["CreatePlaylistOut"]) => {
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
