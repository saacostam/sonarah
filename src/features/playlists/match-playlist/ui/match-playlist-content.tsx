import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Grid,
	Heading,
	Skeleton,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import {
	type MouseEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useQueryTrackRecommendations } from "@/features/playlists/shared/app";
import type { IPlaylist, ITrack } from "@/features/playlists/shared/domain";
import {
	PlaylistBrief,
	TrackItem,
	TrackItemLayout,
} from "@/features/playlists/shared/ui";
import { WebPlayer } from "@/features/web-player/ui";
import {
	Callout,
	EmptyQuery,
	PolymorphicButton,
	QueryError,
} from "@/shared/components";
import {
	CheckIcon,
	ChevronLeftIcon,
	InformationCircleIcon,
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

	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const currentMatchingTrack = useMemo(() => {
		return playlist.tracks.find(
			(_, index) => index === currentMatchingPosition,
		);
	}, [currentMatchingPosition, playlist.tracks]);

	const queryTrackRecommendations = useQueryTrackRecommendations({
		enabled: !!currentMatchingTrack,
		req: {
			name: currentMatchingTrack?.name || "",
			artists: currentMatchingTrack?.artistNames || [],
		},
	});

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

	const [deltaY, setDeltaY] = useState(0);
	const tracksContainerRef = useRef<HTMLDivElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onScrollHandler = () => {
			if (
				!tracksContainerRef.current ||
				!searchContainerRef.current ||
				!currentMatchingTrack
			)
				return;

			const currentMatchingTrackElement =
				tracksContainerRef.current.querySelector(
					`[id="${currentMatchingTrack.id}"]`,
				);

			if (!currentMatchingTrackElement) return;

			const currentMatchingTrackElementBounds = currentMatchingTrackElement
				.getClientRects()
				.item(0);
			const searchContainerBounds = searchContainerRef.current
				.getClientRects()
				.item(0);

			if (!currentMatchingTrackElementBounds || !searchContainerBounds) return;

			setDeltaY(
				Math.max(
					0,
					Math.abs(
						searchContainerBounds.y - currentMatchingTrackElementBounds.y,
					),
				),
			);
		};

		onScrollHandler();
		window.addEventListener("scroll", onScrollHandler);
		return () => window.removeEventListener("scroll", onScrollHandler);
	}, [currentMatchingTrack]);

	const onClickCreateHandler = useCallback(() => {
		setStatus({
			type: "create-playlist",
			uris: matchingTracks.map((match) => match.track.uri),
		});
	}, [matchingTracks, setStatus]);

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

				<div style={{ width: "100%", padding: 0 }} ref={searchContainerRef}>
					<Card key={currentMatchingPosition} style={{ marginTop: deltaY }}>
						<Flex align="center" direction="row" gap="4" justify="between">
							<Heading>Match Track</Heading>
							<Tooltip content="How matching works">
								<Button
									onClick={() => setIsInfoOpen((v) => !v)}
									style={{ padding: "0.4rem" }}
									variant={isInfoOpen ? "solid" : "soft"}
								>
									<InformationCircleIcon height={20} width={20} />
								</Button>
							</Tooltip>
						</Flex>
						{currentMatchingTrack && (
							<>
								<Text>{currentMatchingTrack.name}</Text>{" "}
								<Text size="2" style={{ color: "var(--accent-9)" }}>
									by {currentMatchingTrack.artistNames.join(", ")}
								</Text>
							</>
						)}

						<Callout
							my="3"
							dismissable
							dismissed={{
								value: !isInfoOpen,
								onDismiss: () => setIsInfoOpen(false),
							}}
						>
							Matches advance automatically and can be changed anytime. You can
							skip tracks if needed.
						</Callout>

						<Box mt="2">
							{queryTrackRecommendations.isLoading ? (
								<Flex direction="column" gap="2">
									{new Array(4).fill(null).map((_, index) => (
										<Skeleton key={+index} height="74px" width="100%" />
									))}
								</Flex>
							) : queryTrackRecommendations.isSuccess ? (
								queryTrackRecommendations.data.playlists.length > 0 ? (
									<MatchPlaylistRecommendations
										recommendations={queryTrackRecommendations.data}
										onClickRecommendation={onClickRecommendation}
									/>
								) : (
									<EmptyQuery />
								)
							) : (
								<QueryError
									title="Unable to fetch track recommendations"
									error={queryTrackRecommendations.error}
									retry={{
										onClick: queryTrackRecommendations.refetch,
										isPending: queryTrackRecommendations.isFetching,
									}}
								/>
							)}
						</Box>
					</Card>
				</div>
			</Grid>
		</>
	);
}
