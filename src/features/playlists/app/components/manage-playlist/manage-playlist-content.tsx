import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import type { IPlaylist } from "@/features/playlists/domain";
import { formatTimeFromMilliseconds } from "@/shared/utils";
import { TrackItem } from "./track-item";

export interface ManagePlaylistContentProps {
	playlist: IPlaylist;
}

export function ManagePlaylistContent({
	playlist,
}: ManagePlaylistContentProps) {
	const formatTime = useMemo(
		() =>
			formatTimeFromMilliseconds(
				playlist.tracks.reduce((sum, track) => sum + track.durationInMs, 0),
			),
		[playlist.tracks],
	);

	return (
		<>
			<Heading mb="4">Manage Playlist</Heading>
			<Card>
				<Flex gap="4" wrap="wrap">
					<Avatar fallback={playlist.name} src={playlist.pictureUrl} size="7" />
					<Flex direction="column" justify="between">
						<div>
							<Heading size="4" truncate>
								{playlist.name}
							</Heading>
							<Text size="3" truncate style={{ color: "var(--gray-11)" }}>
								by {playlist.creatorName}
							</Text>
						</div>
						<Text size="2" color="red">
							{playlist.numberOfTracks} songs • {formatTime}
						</Text>
					</Flex>
				</Flex>
			</Card>
			<Heading mt="6" size="5">
				Tracks
			</Heading>
			<Flex direction="column" gap="4" wrap="nowrap" my="4">
				{playlist.tracks.map((track, index) => (
					<TrackItem key={track.id} track={track} order={index + 1} />
				))}
			</Flex>
		</>
	);
}
