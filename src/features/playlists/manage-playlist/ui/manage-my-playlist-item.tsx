import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContextMenu } from "@radix-ui/themes";
import { TrackItem, type TrackItemProps } from "@/features/playlists/shared/ui";
import { TrashIcon } from "@/shared/icons";

export interface ManageMyPlaylistItemProps extends TrackItemProps {
	onDelete: (uri: string) => void;
}

export function ManageMyPlaylistItem(props: ManageMyPlaylistItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: props.track.id,
			transition: {
				duration: 50,
				easing: "ease-out",
			},
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: "context-menu",
	};

	const { onDelete, ...rest } = props;

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
					<TrackItem {...rest} />
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item
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
