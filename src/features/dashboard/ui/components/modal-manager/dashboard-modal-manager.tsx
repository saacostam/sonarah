import { Dialog } from "@radix-ui/themes";
import { useCallback } from "react";
import { CreatePlaylist } from "@/features/playlists/app";
import { useDashboardModalManager } from "../../contexts";

export function DashboardModalManager() {
	const { setStatus, status } = useDashboardModalManager();

	const onClose = useCallback(() => setStatus({ type: "browse" }), [setStatus]);

	return (
		<>
			{
				<Dialog.Root
					open={status.type === "create-playlist"}
					onOpenChange={onClose}
				>
					<Dialog.Content>
						<Dialog.Title>Create Playlist</Dialog.Title>
						<CreatePlaylist onCancel={onClose} />
					</Dialog.Content>
				</Dialog.Root>
			}
		</>
	);
}
