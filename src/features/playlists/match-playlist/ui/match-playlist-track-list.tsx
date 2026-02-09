import { Badge, Flex, Grid, Heading } from "@radix-ui/themes";
import type { MouseEventHandler } from "react";
import type { IPlaylist } from "@/features/playlists/shared/domain";
import { TrackItem, TrackItemLayout } from "@/features/playlists/shared/ui";
import { CheckIcon, MinusCircleIcon } from "@/shared/icons";
import { nestedRequestAnimationFrame, scrollToElement } from "@/shared/utils";
import type { IMatchedTrack } from "../domain";

export interface MatchPlaylistTrackListProps {
	currentMatchingTrackId: string;
	matchedTracks: IMatchedTrack[];
	onClickTrack: (trackId: string) => void;
	playlist: IPlaylist;
}

export function MatchPlaylistTrackList({
	currentMatchingTrackId,
	matchedTracks,
	onClickTrack,
	playlist,
}: MatchPlaylistTrackListProps) {
	return (
		<Flex direction="column" gap="2">
			<Grid gap="2" columns="50% 50%">
				<Heading size="5">Reference Playlist</Heading>
				<Heading size="5">Matched Playlist</Heading>
			</Grid>
			{playlist.tracks.map((track, index) => {
				const isMatching = track.id === currentMatchingTrackId;

				const matchedTrack = matchedTracks.find(
					(match) => match.referenceTrackId === track.id,
				);

				const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
					onClickTrack(track.id);
					const { currentTarget } = e;
					nestedRequestAnimationFrame(
						() => scrollToElement(currentTarget, 16),
						10,
					);
				};

				const matchingTrackRightSlot = (
					<Badge color={matchedTrack ? "green" : "gray"}>
						{matchedTrack ? (
							<CheckIcon height={16} width={16} />
						) : (
							<MinusCircleIcon height={16} width={16} />
						)}
					</Badge>
				);

				return (
					<Grid key={track.id} gap="2" columns="50% 50%" id={track.id}>
						<button
							className="btn-reset clickable"
							onClick={onClick}
							type="button"
						>
							{/* Displayed order stays 1-indexed */}
							<TrackItem
								order={index + 1}
								track={track}
								hightlighted={isMatching}
							/>
						</button>

						<button
							className="btn-reset clickable"
							onClick={onClick}
							style={{ position: "relative" }}
							type="button"
						>
							{matchedTrack ? (
								<TrackItem
									hightlighted={isMatching}
									order={index + 1}
									track={matchedTrack.newTrack}
									rightSlot={matchingTrackRightSlot}
								/>
							) : (
								<TrackItemLayout
									avatar={{ fallback: String(index + 1) }}
									header="Waiting for a match"
									subheader="Select a track to continue"
									highlighted={isMatching}
									rightSlot={matchingTrackRightSlot}
								/>
							)}
						</button>
					</Grid>
				);
			})}
		</Flex>
	);
}
