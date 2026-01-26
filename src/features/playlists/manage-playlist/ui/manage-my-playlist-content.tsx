import { Box, Button, Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import { useCallback } from "react";
import type { IPlaylist } from "@/features/playlists/shared/domain";
import { PlaylistBrief } from "@/features/playlists/shared/ui";
import { EmptyQuery } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { useManagePlaylistModalManager } from "../app";
import { ManageMyPlaylistItem } from "./manage-my-playlist-item";

export interface ManageMyPlaylistContentProps {
	playlist: IPlaylist;
}

export function ManageMyPlaylistContent({
	playlist,
}: ManageMyPlaylistContentProps) {
	const { setStatus } = useManagePlaylistModalManager();

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

	return (
		<>
			<PlaylistBrief playlist={playlist} />
			<Box mt="6">
				<Heading size="5">Tracks</Heading>
				<Text style={{ color: "var(--gray-11)" }} size="2">
					💡 Right-click a track for more options
				</Text>
			</Box>
			<Flex direction="column" gap="2" wrap="nowrap" my="4">
				{playlist.tracks.length > 0 ? (
					playlist.tracks.map((track, index) => (
						<ManageMyPlaylistItem
							key={track.id}
							track={track}
							order={index + 1}
							onDelete={onDeleteTrack}
						/>
					))
				) : (
					<EmptyQuery description="Looks like this playlist is empty." />
				)}
				<Tooltip content="Add a track to the current playlist">
					<Button
						onClick={onAddTrack}
						type="button"
						style={{ cursor: "pointer" }}
					>
						<PlusIcon height={24} width={24} />
						Add Track
					</Button>
				</Tooltip>
			</Flex>
		</>
	);
}
