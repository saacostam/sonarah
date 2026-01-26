import { Button, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { useMutationRemoveItemsFromPlaylist } from "@/features/playlists/shared/app";

export interface DeleteTrackProps {
	onClose: () => void;
	onError: (e: unknown) => void;
	onSuccess: () => void;
	playlistId: string;
	trackUri: string;
}

export function DeleteTrack({
	onClose,
	onError,
	onSuccess,
	playlistId,
	trackUri,
}: DeleteTrackProps) {
	const removeItemsFromPlaylist = useMutationRemoveItemsFromPlaylist();

	const onClickRemove = useCallback(() => {
		removeItemsFromPlaylist.mutate(
			{
				id: playlistId,
				uris: [trackUri],
			},
			{
				onSuccess,
				onError,
				onSettled: onClose,
			},
		);
	}, [
		onClose,
		onError,
		onSuccess,
		playlistId,
		removeItemsFromPlaylist,
		trackUri,
	]);

	return (
		<Flex direction="column" gap="4">
			<Text>Are you sure you want to delete this track</Text>
			<Flex gap="4" justify="end">
				<Button type="button" variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button
					color="red"
					loading={removeItemsFromPlaylist.isPending}
					onClick={onClickRemove}
					type="button"
				>
					Remove
				</Button>
			</Flex>
		</Flex>
	);
}
