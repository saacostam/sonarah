import { ContextMenu } from "@radix-ui/themes";
import { TrackItem, type TrackItemProps } from "@/features/playlists/shared/ui";
import { TrashIcon } from "@/shared/icons";

export interface ManageMyPlaylistItemProps extends TrackItemProps {
	onDelete: (uri: string) => void;
}

export function ManageMyPlaylistItem(props: ManageMyPlaylistItemProps) {
	const { onDelete, ...rest } = props;

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<div style={{ cursor: "context-menu" }}>
					<TrackItem {...rest} />
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item
					color="red"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(props.track.uri);
					}}
					aria-label="Delete"
				>
					Delete <TrashIcon height={16} width={16} />
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}
