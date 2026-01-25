import { Button, Flex, Heading, Tooltip } from "@radix-ui/themes";
import { useCallback } from "react";
import type { IPlaylist } from "@/features/playlists/shared/domain";
import { PlaylistBrief, TrackItem } from "@/features/playlists/shared/ui";
import { EmptyQuery } from "@/shared/components";
import { PlusIcon } from "@/shared/icons";
import { useManagePlaylistModalManager } from "../app";

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

	return (
		<>
			<PlaylistBrief playlist={playlist} />
			<Heading mt="6" size="5">
				Tracks
			</Heading>
			<Flex direction="column" gap="2" wrap="nowrap" my="4">
				{playlist.tracks.length > 0 ? (
					<>
						{playlist.tracks.map((track, index) => (
							<TrackItem key={track.id} track={track} order={index + 1} />
						))}
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
					</>
				) : (
					<EmptyQuery description="Looks like this playlist is empty." />
				)}
			</Flex>
		</>
	);
}
