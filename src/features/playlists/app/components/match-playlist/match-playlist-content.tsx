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
	const [currentMatchingPosition, setCurrentMatchingPosition] = useState(1);
	const [matchingTracks] = useState<IMatchedTrack[]>([]);

	const tracksContainerRef = useRef<HTMLDivElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	const currentMatchingTrack = useMemo(() => {
		return playlist.tracks.find((_, index) => {
			const position = index + 1;
			return position === currentMatchingPosition;
		});
	}, [currentMatchingPosition, playlist.tracks]);

	const [deltaY, setDeltaY] = useState(0);

	const queryTrackRecommendations = useQueryTrackRecommendations({
		enabled: !!currentMatchingTrack?.name,
		req: {
			name: currentMatchingTrack?.name || "", // Only called when id is defined
		},
	});

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

		onScrollHandler(); // init
		window.addEventListener("scroll", onScrollHandler); // on events/change
		return () => window.removeEventListener("scroll", onScrollHandler); // cleanup
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
						const position = index + 1;
						const isMatching = position === currentMatchingPosition;

						const matchedTrack = matchingTracks.find(
							(track) => track.position === position,
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
									<TrackItem
										order={position}
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
											avatar={{
												fallback: String(position),
											}}
											header="▶"
											subheader="•"
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
					<Card
						style={{
							marginTop: deltaY,
						}}
					>
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
