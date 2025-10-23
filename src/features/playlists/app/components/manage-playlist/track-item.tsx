import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import type { ITrack } from "@/features/playlists/domain";
import { formatTimeFromMilliseconds } from "@/shared/utils";

export interface TrackItemProps {
	track: ITrack;
	order: number;
}

export function TrackItem({ track, order }: TrackItemProps) {
	const formatTime = formatTimeFromMilliseconds(track.durationInMs);

	return (
		<Card>
			<Flex direction="row" gap="4" wrap="wrap">
				<Avatar fallback={order} src={track.pictureUrl} size="4" />
				<Flex direction="column" gap="2">
					<div>
						<Heading size="3" truncate>
							{track.name}
						</Heading>
						<Text size="2" truncate style={{ color: "var(--gray-11)" }}>
							by {track.artistNames.join(", ")} • {formatTime}
						</Text>
					</div>
				</Flex>
			</Flex>
		</Card>
	);
}
