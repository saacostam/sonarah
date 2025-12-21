import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { RouteName } from "@/features/navigation/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { XIcon } from "@/shared/icons";
import { getErrorMessage } from "@/shared/utils";
import { useMatchPlaylistModalManger } from "../../hooks";
import { CreateMatchedPlaylist } from "./create-matched-playlist";

export function MatchPlaylistModalManagerRenderer() {
	const {
		errorLoggerAdapter,
		navigationAdapter,
		notificationsAdapter,
		routerAdapter,
	} = useAdapters();

	const { status, setStatus } = useMatchPlaylistModalManger();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);

	const onCreateMatchedPlaylistSuccess = useCallback(() => {
		notificationsAdapter.notify(
			INotificationAdapterType.SUCCESS,
			"Added",
			"Tracks added to playlist",
		);

		routerAdapter.push(
			navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }),
		);
	}, [notificationsAdapter, navigationAdapter, routerAdapter]);

	const onCreateMatchedPlaylistError = useCallback(
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
		<Dialog.Root
			open={status.type === "create-playlist"}
			onOpenChange={onClose}
		>
			<Dialog.Content width="512px">
				<Flex direction="row" gap="2" justify="between">
					<Dialog.Title>Create Playlist</Dialog.Title>
					<Button onClick={onClose} variant="ghost">
						<XIcon height={20} width={20} />
					</Button>
				</Flex>
				<CreateMatchedPlaylist
					onClose={onClose}
					onError={onCreateMatchedPlaylistError}
					onSuccess={onCreateMatchedPlaylistSuccess}
					tracksUris={status.type === "create-playlist" ? status.uris : []}
				/>
			</Dialog.Content>
		</Dialog.Root>
	);
}
