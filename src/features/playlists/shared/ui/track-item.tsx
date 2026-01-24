import type { ReactNode } from "react";
import { formatTimeFromMilliseconds } from "@/shared/utils";
import type { ITrack } from "../domain";
import { TrackItemLayout } from "./track-item-layout";

export interface TrackItemProps {
	track: ITrack;
	order: number;
	hightlighted?: boolean;
	rightSlot?: ReactNode;
}

export function TrackItem({
	track,
	order,
	hightlighted,
	rightSlot,
}: TrackItemProps) {
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
			rightSlot={rightSlot}
		/>
	);
}
