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
	defaultTrackId: string;
	onBackHref: string;
	playlist: IPlaylist;
}

export function MatchPlaylistContent({
	defaultTrackId,
	onBackHref,
	playlist,
}: MatchPlaylistContentProps) {
	const { setStatus } = useMatchPlaylistModalManger();

	const [currentlyMatchingTrackId, setCurrentlyMatchingTrackId] =
		useState(defaultTrackId);
	const [matchedTracks, setMatchedTracks] = useState<IMatchedTrack[]>([]);

	const currentMatchingTrack = useMemo(() => {
		return playlist.tracks.find(
			(track) => track.id === currentlyMatchingTrackId,
		);
	}, [currentlyMatchingTrackId, playlist.tracks]);

	const onClickRecommendation = useCallback(
		(track: ITrack) => {
			setMatchedTracks((currMatchedTracks) => {
				const existingTrack = currMatchedTracks.find(
					(match) => match.referenceTrackId === currentlyMatchingTrackId,
				);

				const newMatchingTracks: IMatchedTrack[] = existingTrack
					? currMatchedTracks.map((match) =>
							match.referenceTrackId === currentlyMatchingTrackId
								? {
										...match,
										newTrack: track,
									}
								: match,
						)
					: [
							...currMatchedTracks,
							{ newTrack: track, referenceTrackId: currentlyMatchingTrackId },
						];

				const nextTrackId =
					playlist.tracks.reduce((nextTrackId: string | null, track) => {
						if (nextTrackId !== null) return nextTrackId;

						const hasMatchingTrack = newMatchingTracks.find(
							(mt) => mt.referenceTrackId === track.id,
						);
						return !hasMatchingTrack ? track.id : null;
					}, null) ?? defaultTrackId;

				setCurrentlyMatchingTrackId(nextTrackId);
				return newMatchingTracks;
			});
		},
		[currentlyMatchingTrackId, defaultTrackId, playlist.tracks],
	);

	const onClickCreateHandler = useCallback(() => {
		setStatus({
			type: "create-playlist",
			uris: matchedTracks.map((match) => match.newTrack.uri),
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
					currentMatchingTrackId={currentlyMatchingTrackId}
					matchedTracks={matchedTracks}
					onClickTrack={setCurrentlyMatchingTrackId}
					playlist={playlist}
				/>

				<RelativeScroll anchor={anchorElement}>
					{currentMatchingTrack && (
						<MatchPlaylistRecommendations
							currentMatchingTrack={currentMatchingTrack}
							key={currentlyMatchingTrackId}
							onClickRecommendation={onClickRecommendation}
						/>
					)}
				</RelativeScroll>
			</Grid>
		</>
	);
}
