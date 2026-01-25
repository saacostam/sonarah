import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
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
		},
		[errorLoggerAdapter, notificationsAdapter],
	);

	return (
		<Dialog.Root open={status.type === "search-track"} onOpenChange={onClose}>
			<Dialog.Content maxWidth="820px">
				<Flex direction="row" gap="2" justify="between">
					<Dialog.Title>Add Track</Dialog.Title>
					<Button onClick={onClose} variant="ghost">
						<XIcon height={20} width={20} />
					</Button>
				</Flex>
				<SearchTrack
					onCancel={onClose}
					onError={onAddItemToPlaylistError}
					onSuccess={onAddItemToPlaylistSuccess}
					playlistId={status.type === "search-track" ? status.playlistId : ""}
				/>
			</Dialog.Content>
		</Dialog.Root>
	);
}
