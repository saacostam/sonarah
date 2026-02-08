import { Badge, Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import {
	type MouseEventHandler,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import type { IPlaylist, ITrack } from "@/features/playlists/shared/domain";
import {
	PlaylistBrief,
	TrackItem,
	TrackItemLayout,
} from "@/features/playlists/shared/ui";
import { WebPlayer } from "@/features/web-player/ui";
import { PolymorphicButton, RelativeScroll } from "@/shared/components";
import {
	CheckIcon,
	ChevronLeftIcon,
	MinusCircleIcon,
	PlayIcon,
} from "@/shared/icons";
import { nestedRequestAnimationFrame, scrollToElement } from "@/shared/utils";
import { useMatchPlaylistModalManger } from "../app";
import { MatchPlaylistRecommendations } from "./match-playlist-recommendations";

export interface MatchPlaylistContentProps {
	onBackHref: string;
	playlist: IPlaylist;
}

export interface IMatchedTrack {
	position: number;
	track: ITrack;
}

export function MatchPlaylistContent({
	onBackHref,
	playlist,
}: MatchPlaylistContentProps) {
	const { setStatus } = useMatchPlaylistModalManger();

	const [currentMatchingPosition, setCurrentMatchingPosition] = useState(0);
	const [matchingTracks, setMatchingTracks] = useState<IMatchedTrack[]>([]);

	const currentMatchingTrack = useMemo(() => {
		return playlist.tracks.find(
			(_, index) => index === currentMatchingPosition,
		);
	}, [currentMatchingPosition, playlist.tracks]);

	const onClickRecommendation = useCallback(
		(track: ITrack) => {
			setMatchingTracks((oldMatchingTracks) => {
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
							!matchingTracks.find((match) => match.position === nextPosition)
						) {
							setCurrentMatchingPosition(nextPosition);
							break;
						}
					}
				}

				return newMatchingTracks;
			});
		},
		[currentMatchingPosition, matchingTracks, playlist.tracks],
	);

	const onClickCreateHandler = useCallback(() => {
		setStatus({
			type: "create-playlist",
			uris: matchingTracks.map((match) => match.track.uri),
		});
	}, [matchingTracks, setStatus]);

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
									Next: Create Playlist {matchingTracks.length}/
									{playlist.tracks.length}
								</>
							),
						}}
						color={
							matchingTracks.length < playlist.tracks.length
								? "yellow"
								: undefined
						}
						variant={
							matchingTracks.length < playlist.tracks.length
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
			<Grid columns="60% 40%" gap="4" my="6">
				<Flex direction="column" gap="2" ref={tracksContainerRef}>
					<Grid gap="2" columns="50% 50%">
						<Heading size="5">Reference Playlist</Heading>
						<Heading size="5">Matched Playlist</Heading>
					</Grid>
					{playlist.tracks.map((track, index) => {
						const position = index;
						const isMatching = position === currentMatchingPosition;

						const matchedTrack = matchingTracks.find(
							(match) => match.position === position,
						);

						const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
							setCurrentMatchingPosition(position);
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
											track={matchedTrack.track}
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
