import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Button, Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import { useCallback } from "react";
import { RingLoader } from "react-spinners";
import { useMutationReorderItemsFromPlaylist } from "@/features/playlists/shared/app";
import type {
	IPlaylist,
	IPlaylistClientPayload,
} from "@/features/playlists/shared/domain";
import { PlaylistBrief } from "@/features/playlists/shared/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import type { OptimDataSetter } from "@/shared/async-state";
import { EmptyQuery } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { getErrorMessage } from "@/shared/utils";
import { useManagePlaylistModalManager } from "../app";
import { ManageMyPlaylistItem } from "./manage-my-playlist-item";

export interface ManageMyPlaylistContentProps {
	optimSetPlaylist: OptimDataSetter<IPlaylistClientPayload["GetByIdOut"]>;
	playlist: IPlaylist;
}

export function ManageMyPlaylistContent({
	optimSetPlaylist,
	playlist,
}: ManageMyPlaylistContentProps) {
	const { notificationsAdapter } = useAdapters();

	const { setStatus } = useManagePlaylistModalManager();

	const reorderItemsFromPlaylist = useMutationReorderItemsFromPlaylist();

	const onAddTrack = useCallback(
		() =>
			setStatus({
				type: "search-track",
				playlistId: playlist.id,
			}),
		[playlist.id, setStatus],
	);

	const onDeleteTrack = useCallback(
		(trackUri: string) =>
			setStatus({
				type: "delete-track",
				trackUri,
				playlistId: playlist.id,
			}),
		[playlist.id, setStatus],
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (over && active.id !== over.id) {
				optimSetPlaylist((query) => {
					if (query === undefined) return query;

					const oldIndex = query.playlist.tracks.findIndex(
						(t) => t.id === active.id,
					);
					const newIndex = query.playlist.tracks.findIndex(
						(t) => t.id === over.id,
					);
					if (oldIndex === -1 || newIndex === -1) return query;

					const track = query.playlist.tracks.at(oldIndex);
					if (!track) return query;

					const newArray = arrayMove(query.playlist.tracks, oldIndex, newIndex);

					const isEqual = newArray.every(
						(newArrayTrack, index) =>
							newArrayTrack.id === query.playlist.tracks.at(index)?.id,
					);
					if (isEqual) return query;

					reorderItemsFromPlaylist.mutate(
						{
							playlistId: playlist.id,
							rangeStart: oldIndex,
							insertBefore: newIndex + (oldIndex < newIndex ? 1 : 0),
							rangeLength: 1,
						},
						{
							onError: (e) => {
								notificationsAdapter.notify(
									INotificationAdapterType.ERROR,
									"Error",
									getErrorMessage(
										e,
										"Unnable to reorder tracks. Please try again.",
									),
								);
							},
						},
					);

					return {
						...query,
						playlist: {
							...query.playlist,
							tracks: [...newArray],
						},
					};
				});
			}
		},
		[
			optimSetPlaylist,
			notificationsAdapter,
			playlist.id,
			reorderItemsFromPlaylist,
		],
	);

	return (
		<>
			<PlaylistBrief playlist={playlist} />
			<Box mt="6">
				<Flex align="center" gap="4">
					<Heading size="5">Tracks</Heading>
					{reorderItemsFromPlaylist.isPending && (
						<RingLoader color="var(--accent-9)" size="1rem" />
					)}
				</Flex>
				<Text style={{ color: "var(--gray-11)" }} size="2">
					Right-click to delete. Drag to reorder.
				</Text>
			</Box>
			<Flex direction="column" gap="2" wrap="nowrap" my="4">
				{playlist.tracks.length > 0 ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={playlist.tracks}
							strategy={verticalListSortingStrategy}
							disabled={reorderItemsFromPlaylist.isPending}
						>
							{playlist.tracks.map((track, index) => (
								<ManageMyPlaylistItem
									key={track.id}
									track={track}
									order={index + 1}
									onDelete={onDeleteTrack}
								/>
							))}
						</SortableContext>
					</DndContext>
				) : (
					<EmptyQuery description="Looks like this playlist is empty." />
				)}
				<Tooltip content="Add a track to the current playlist">
					<Button
						onClick={onAddTrack}
						type="button"
						style={{ cursor: "pointer" }}
						variant="soft"
					>
						<PlusIcon height={24} width={24} />
						Add Track
					</Button>
				</Tooltip>
			</Flex>
		</>
	);
}
