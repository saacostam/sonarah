import {
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Skeleton,
	Text,
} from "@radix-ui/themes";
import {
	type MouseEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { IPlaylist, ITrack } from "@/features/playlists/domain";
import { EmptyQuery, QueryError } from "@/shared/components";
import { nestedRequestAnimationFrame, scrollToElement } from "@/shared/utils";
import { useQueryTrackRecommendations } from "../../hooks";
import { PlaylistBrief, TrackItem, TrackItemLayout } from "../shared";

export interface MatchPlaylistContentProps {
	playlist: IPlaylist;
}

export interface IMatchedTrack {
	position: number;
	track: ITrack;
}

export function MatchPlaylistContent({ playlist }: MatchPlaylistContentProps) {
	const [currentMatchingPosition, setCurrentMatchingPosition] = useState(0);
	const [matchingTracks, setMatchingTracks] = useState<IMatchedTrack[]>([]);

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
		(track: ITrack, position: number) => {
			setMatchingTracks((oldMatchingTracks) => {
				const hasPosition = oldMatchingTracks.find(
					(match) => match.position === position,
				);

				const newMatchingTracks = hasPosition
					? oldMatchingTracks.map((match) =>
							match.position === position
								? {
										...match,
										track,
									}
								: match,
						)
					: [...oldMatchingTracks, { track, position }];

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

	return (
		<>
			<PlaylistBrief playlist={playlist} />
			<Heading size="5" mt="6">
				Reference Playlist
			</Heading>
			<Grid columns="60% 40%" gap="4" my="4">
				<Flex direction="column" gap="2" ref={tracksContainerRef}>
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
										/>
									) : (
										<TrackItemLayout
											avatar={{ fallback: String(index + 1) }}
											header="Empty slot"
											subheader="Select a suitable track"
											highlighted={isMatching}
										/>
									)}
									<Badge
										color={matchedTrack ? "green" : "red"}
										style={{ position: "absolute", top: "1rem", right: "1rem" }}
									>
										{matchedTrack ? "Matched" : "Unmatched"}
									</Badge>
								</button>
							</Grid>
						);
					})}
				</Flex>

				<div style={{ width: "100%", padding: 0 }} ref={searchContainerRef}>
					<Card style={{ marginTop: deltaY }}>
						<Heading>Match Track</Heading>
						{currentMatchingTrack && (
							<>
								<Text>{currentMatchingTrack.name}</Text>{" "}
								<Text size="2" style={{ color: "var(--accent-9)" }}>
									by {currentMatchingTrack.artistNames.join(", ")}
								</Text>
							</>
						)}

						<Box p="1" mt="4" style={{ maxHeight: "400px", overflowY: "auto" }}>
							{queryTrackRecommendations.isLoading ? (
								<Flex direction="column" gap="2">
									{new Array(4).fill(null).map((_, index) => (
										<Skeleton key={+index} height="74px" width="100%" />
									))}
								</Flex>
							) : queryTrackRecommendations.isSuccess ? (
								queryTrackRecommendations.data.tracks.length > 0 ? (
									<Flex direction="column" gap="2">
										{queryTrackRecommendations.data.tracks.map(
											(track, index) => (
												<button
													key={+index}
													className="clickable btn-reset"
													type="button"
													onClick={() =>
														onClickRecommendation(
															track,
															currentMatchingPosition,
														)
													}
												>
													<TrackItem track={track} order={index + 1} />
												</button>
											),
										)}
									</Flex>
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
