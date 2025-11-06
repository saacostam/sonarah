import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouteName } from "@/features/navigation/domain";
import { INotificationAdapterType } from "@/features/notifications/domain";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { XIcon } from "@/shared/icons";
import {
	useMatchPlaylistModalManger,
	useMutationAddItemToPlaylist,
} from "../../hooks";
import { CreatePlaylist } from "../create-playlist";

export function MatchPlaylistModalManagerRenderer() {
	const {
		errorLoggerAdapter,
		notificationsAdapter,
		routerAdapter,
		navigationAdapter,
	} = useAdapters();

	const { mutate: addItemToPlaylistMutate } = useMutationAddItemToPlaylist();

	const { status, setStatus } = useMatchPlaylistModalManger();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);

	const onCreatePlaylistSuccess = useCallback(
		(args: IPlaylistRepositoryPayload["CreatePlaylistOut"]) => {
			const { id } = args;

			if (status.type !== "create-playlist") {
				onClose();
				notificationsAdapter.notify(
					INotificationAdapterType.ERROR,
					"Tracks not found",
					"Create action was triggered without selecting tracks",
				);
				return;
			}

			addItemToPlaylistMutate(
				{ id, uris: status.uris },
				{
					onSuccess: () => {
						notificationsAdapter.notify(
							INotificationAdapterType.SUCCESS,
							"Added",
							"Tracks added to playlist",
						);

						routerAdapter.push(
							navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }),
						);
					},
					onError: (e) => {
						errorLoggerAdapter.logAny(e);
						notificationsAdapter.notify(
							INotificationAdapterType.ERROR,
							"Error",
							"Unnable to add tracks to playlist",
						);
					},
					onSettled: () => onClose(),
				},
			);
		},
		[
			addItemToPlaylistMutate,
			errorLoggerAdapter,
			notificationsAdapter,
			onClose,
			routerAdapter,
			navigationAdapter,
			status,
		],
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
				<CreatePlaylist
					onCancel={onClose}
					onSuccess={onCreatePlaylistSuccess}
				/>
			</Dialog.Content>
		</Dialog.Root>
	);
}
