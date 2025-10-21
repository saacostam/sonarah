import { Dialog } from "@radix-ui/themes";
import { useCallback } from "react";
import { CreatePlaylist } from "@/features/playlists/app";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";
import { useDashboardModalManager } from "../../contexts";

export function DashboardModalManager() {
	const router = useRouter();

	const { setStatus, status } = useDashboardModalManager();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);
	const onSuccess = useCallback(
		(args: IPlaylistRepositoryPayload["CreatePlaylistOut"]) => {
			onClose();
			router.push(
				router.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: args.id },
				}),
			);
		},
		[onClose, router],
	);

	return (
		<>
			{
				<Dialog.Root
					open={status.type === "create-playlist"}
					onOpenChange={onClose}
				>
					<Dialog.Content>
						<Dialog.Title>Create Playlist</Dialog.Title>
						<CreatePlaylist onCancel={onClose} onSuccess={onSuccess} />
					</Dialog.Content>
				</Dialog.Root>
			}
		</>
	);
}
