import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { useAdapters } from "@/features/adapters/app";
import { useDashboardModalManager } from "@/features/dashboard/app";
import { RouteName } from "@/features/navigation/domain";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { CreatePlaylist, SearchPlaylist } from "@/features/playlists/app";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { XIcon } from "@/shared/icons";

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
			onClose();
			routerAdapter.push(
				navigationAdapter.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: args.id },
				}),
			);
		},
		[onClose, routerAdapter, navigationAdapter],
	);

	return (
		<>
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
			<Dialog.Root
				open={status.type === "search-playlist"}
				onOpenChange={onClose}
			>
				<Dialog.Content style={{ maxWidth: "1024px" }}>
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title size="7">Import Playlist</Dialog.Title>
						<Button onClick={onClose} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					<SearchPlaylist
						onCancel={onClose}
						onSuccess={onSavePlaylistSuccess}
					/>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
