import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { useCallback, useMemo, useRef, useState } from "react";
import type { IPlaylist, ITrack } from "@/features/playlists/shared/domain";
import { PlaylistBrief } from "@/features/playlists/shared/ui";
import { WebPlayer } from "@/features/web-player/ui";
import { PolymorphicButton, RelativeScroll } from "@/shared/components";
import { ChevronLeftIcon, PlayIcon } from "@/shared/icons";
import { useMatchPlaylistModalManger } from "../app";
import type { IMatchedTrack } from "../domain";
import { MatchPlaylistRecommendations } from "./match-playlist-recommendations";
import { MatchPlaylistTrackList } from "./match-playlist-track-list";

export interface MatchPlaylistContentProps {
	onBackHref: string;
	playlist: IPlaylist;
}

export function MatchPlaylistContent({
	onBackHref,
	playlist,
}: MatchPlaylistContentProps) {
	const { setStatus } = useMatchPlaylistModalManger();

	const [currentMatchingPosition, setCurrentMatchingPosition] = useState(0);
	const [matchedTracks, setMatchedTracks] = useState<IMatchedTrack[]>([]);

	const currentMatchingTrack = useMemo(() => {
		return playlist.tracks.find(
			(_, index) => index === currentMatchingPosition,
		);
	}, [currentMatchingPosition, playlist.tracks]);

	const onClickRecommendation = useCallback(
		(track: ITrack) => {
			setMatchedTracks((oldMatchingTracks) => {
				const hasPosition = oldMatchingTracks.find(
					(match) => match.position === currentMatchingPosition,
				);

				const newMatchingTracks = hasPosition
					? oldMatchingTracks.map((match) =>
							match.position === currentMatchingPosition
								? {
										...match,
										track,
									}
								: match,
						)
					: [
							...oldMatchingTracks,
							{ track, position: currentMatchingPosition },
						];

				const positions = new Set(
					new Array(playlist.tracks.length).fill(null).map((_, index) => index),
				);
				newMatchingTracks.forEach((match) => {
					positions.delete(match.position);
				});
				const areAllTracksMatched = positions.size === 0;

				if (areAllTracksMatched) {
					setCurrentMatchingPosition(0);
				} else {
					// Find the next unmatched position (0-indexed)
					for (let i = 1; i < playlist.tracks.length; i++) {
						const nextPosition =
							(currentMatchingPosition + i) % playlist.tracks.length;

						if (
							!matchedTracks.find((match) => match.position === nextPosition)
						) {
							setCurrentMatchingPosition(nextPosition);
							break;
						}
					}
				}

				return newMatchingTracks;
			});
		},
		[currentMatchingPosition, matchedTracks, playlist.tracks],
	);

	const onClickCreateHandler = useCallback(() => {
		setStatus({
			type: "create-playlist",
			uris: matchedTracks.map((match) => match.track.uri),
		});
	}, [matchedTracks, setStatus]);

	const tracksContainerRef = useRef<HTMLDivElement>(null);
	const anchorElement: HTMLElement | null = useMemo(() => {
		return (
			tracksContainerRef.current?.querySelector(
				`[id="${currentMatchingTrack?.id}"]`,
			) ?? null
		);
	}, [currentMatchingTrack?.id]);

	return (
		<>
			<WebPlayer />
			<Flex direction="column" justify="between" gap="4" mb="4">
				<Flex align="end" direction="row" justify="between" gap="4">
					<PolymorphicButton
						action={{
							action: {
								type: "href",
								href: onBackHref,
							},
							label: (
								<>
									<ChevronLeftIcon width={16} height={16} />
									Back to Manage Playlist
								</>
							),
						}}
						variant="soft"
					/>
					<PolymorphicButton
						action={{
							action: {
								type: "button",
								onClick: onClickCreateHandler,
							},
							label: (
								<>
									<PlayIcon width={16} height={16} />
									Next: Create Playlist {matchedTracks.length}/
									{playlist.tracks.length}
								</>
							),
						}}
						color={
							matchedTracks.length < playlist.tracks.length
								? "yellow"
								: undefined
						}
						variant={
							matchedTracks.length < playlist.tracks.length
								? "outline"
								: "solid"
						}
					/>
				</Flex>
				<Box>
					<Heading>Match Playlist</Heading>
					<Text size="3">
						Build a new playlist by matching tracks one-to-one. For each
						reference track, choose a new track that feels like a good match.
					</Text>
				</Box>
			</Flex>
			<PlaylistBrief playlist={playlist} />
			<Grid columns="60% 40%" gap="4" my="6" ref={tracksContainerRef}>
				<MatchPlaylistTrackList
					currentMatchingPosition={currentMatchingPosition}
					matchedTracks={matchedTracks}
					onClickTrack={setCurrentMatchingPosition}
					playlist={playlist}
				/>

				<RelativeScroll anchor={anchorElement}>
					{currentMatchingTrack && (
						<MatchPlaylistRecommendations
							currentMatchingTrack={currentMatchingTrack}
							key={currentMatchingPosition}
							onClickRecommendation={onClickRecommendation}
						/>
					)}
				</RelativeScroll>
			</Grid>
		</>
	);
}
