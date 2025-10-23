import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import type { IPlaylist } from "@/features/playlists/domain";
import { formatTimeFromMilliseconds } from "@/shared/utils";

export interface PlaylistBriefProps {
	playlist: IPlaylist;
}

export function PlaylistBrief({ playlist }: PlaylistBriefProps) {
	const formatTime = useMemo(
		() =>
			formatTimeFromMilliseconds(
				playlist.tracks.reduce((sum, track) => sum + track.durationInMs, 0),
			),
		[playlist.tracks],
	);

	return (
		<Card>
			<Flex gap="4" wrap="wrap">
				<Avatar fallback={playlist.name} src={playlist.pictureUrl} size="6" />
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
	);
}
