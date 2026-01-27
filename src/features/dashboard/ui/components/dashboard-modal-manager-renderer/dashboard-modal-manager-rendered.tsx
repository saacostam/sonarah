import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { useDashboardModalManager } from "@/features/dashboard/app";
import { CreatePlaylist } from "@/features/playlists/create-playlist/ui";
import { SearchPlaylist } from "@/features/playlists/search-playlist/ui";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/shared/domain";
import { UnfollowPlaylist } from "@/features/playlists/unfollow-playlist/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { XIcon } from "@/shared/icons";
import { getErrorMessage } from "@/shared/utils";

export function DashboardModalManagerRenderer() {
	const { routerAdapter, navigationAdapter, notificationsAdapter } =
		useAdapters();

	const { setStatus, status } = useDashboardModalManager();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);

	const onCreatePlaylistSuccess = useCallback(
		(args: IPlaylistRepositoryPayload["CreatePlaylistOut"]) => {
			onClose();
			notificationsAdapter.notify(
				INotificationAdapterType.SUCCESS,
				"Added",
				"Playlist added successfully",
			);
			routerAdapter.push(
				navigationAdapter.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: args.id },
				}),
			);
		},
		[onClose, routerAdapter, navigationAdapter, notificationsAdapter],
	);

	const onSavePlaylistSuccess = useCallback(
		(args: IPlaylistRepositoryPayload["SaveOut"]) => {
			notificationsAdapter.notify(
				INotificationAdapterType.SUCCESS,
				"Added",
				"Playlist added successfully",
			);

			onClose();

			routerAdapter.push(
				navigationAdapter.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: args.id },
				}),
			);
		},
		[onClose, routerAdapter, navigationAdapter, notificationsAdapter],
	);

	const onSavePlaylistError = useCallback(
		(e: unknown) => {
			const errorDetails = getErrorMessage(e, "");

			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				`We couldn't save the playlist. Please try again. ${errorDetails ?? `Details: ${errorDetails}`}`,
			);

			onClose();
		},
		[notificationsAdapter, onClose],
	);

	const onUnfollowSuccess = useCallback(() => {
		onClose();
		notificationsAdapter.notify(
			INotificationAdapterType.SUCCESS,
			"Unfollowed",
			"Playlist unfollowed successfully",
		);
	}, [notificationsAdapter, onClose]);

	return (
		<>
			<Dialog.Root
				open={status.type === "create-playlist"}
				onOpenChange={onClose}
			>
				<Dialog.Content maxWidth="512px">
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
			<Dialog.Root
				open={status.type === "search-playlist"}
				onOpenChange={onClose}
			>
				<Dialog.Content maxWidth="820px">
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title size="6">Import Playlist</Dialog.Title>
						<Button onClick={onClose} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					<SearchPlaylist
						onError={onSavePlaylistError}
						onSuccess={onSavePlaylistSuccess}
					/>
				</Dialog.Content>
			</Dialog.Root>
			<Dialog.Root
				open={status.type === "unfollow-playlist"}
				onOpenChange={onClose}
			>
				<Dialog.Content maxWidth="512px">
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title>Unfollow Playlist</Dialog.Title>
						<Button onClick={onClose} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					{status.type === "unfollow-playlist" && (
						<UnfollowPlaylist
							id={status.payload.id}
							onCancel={onClose}
							onSuccess={onUnfollowSuccess}
						/>
					)}
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
