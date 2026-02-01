import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { DeleteTrack } from "@/features/playlists/delete-track/ui";
import { SearchTrack } from "@/features/playlists/search-track/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { XIcon } from "@/shared/icons";
import { getErrorMessage } from "@/shared/utils";
import { useManagePlaylistModalManager } from "../app";

export function ManagePlaylistModalManagerRenderer() {
	const { errorLoggerAdapter, notificationsAdapter } = useAdapters();

	const { status, setStatus } = useManagePlaylistModalManager();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);

	// Add Item
	const onAddItemToPlaylistSuccess = useCallback(() => {
		notificationsAdapter.notify(
			INotificationAdapterType.SUCCESS,
			"Added",
			"Tracks added to playlist",
		);
	}, [notificationsAdapter]);

	const onAddItemToPlaylistError = useCallback(
		(e: unknown) => {
			errorLoggerAdapter.logAny(e);
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				getErrorMessage(e, "Unnable to add tracks to playlist"),
			);

			onClose();
		},
		[errorLoggerAdapter, onClose, notificationsAdapter],
	);

	// Delete Track
	const onDeleteTrackSuccess = useCallback(() => {
		notificationsAdapter.notify(
			INotificationAdapterType.SUCCESS,
			"Added",
			"Track was deleted successfully",
		);
	}, [notificationsAdapter]);

	const onDeleteTrackError = useCallback(
		(e: unknown) => {
			errorLoggerAdapter.logAny(e);
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				getErrorMessage(e, "Unnable to remove track from playlist"),
			);
		},
		[errorLoggerAdapter, notificationsAdapter],
	);

	return (
		<>
			<Dialog.Root open={status.type === "search-track"} onOpenChange={onClose}>
				<Dialog.Content maxWidth="820px">
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title size="6">Add Track</Dialog.Title>
						<Button onClick={onClose} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					<SearchTrack
						onError={onAddItemToPlaylistError}
						onSuccess={onAddItemToPlaylistSuccess}
						playlistId={status.type === "search-track" ? status.playlistId : ""}
					/>
				</Dialog.Content>
			</Dialog.Root>
			<Dialog.Root open={status.type === "delete-track"} onOpenChange={onClose}>
				<Dialog.Content maxWidth="512px">
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title>Delete Track</Dialog.Title>
						<Button onClick={onClose} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					<DeleteTrack
						onClose={onClose}
						onError={onDeleteTrackError}
						onSuccess={onDeleteTrackSuccess}
						playlistId={status.type === "delete-track" ? status.playlistId : ""}
						trackUri={status.type === "delete-track" ? status.trackUri : ""}
					/>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
