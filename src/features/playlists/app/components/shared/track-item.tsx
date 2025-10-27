import type { ITrack } from "@/features/playlists/domain";
import { formatTimeFromMilliseconds } from "@/shared/utils";
import { TrackItemLayout } from "./track-item-layout";

export interface TrackItemProps {
	track: ITrack;
	order: number;
	hightlighted?: boolean;
}

export function TrackItem({ track, order, hightlighted }: TrackItemProps) {
	const formatTime = formatTimeFromMilliseconds(track.durationInMs);

	return (
		<TrackItemLayout
			avatar={{
				fallback: String(order),
				src: track.pictureUrl,
			}}
			header={track.name}
			subheader={`by ${track.artistNames.join(", ")} • ${formatTime}`}
			highlighted={!!hightlighted}
		/>
	);
}
