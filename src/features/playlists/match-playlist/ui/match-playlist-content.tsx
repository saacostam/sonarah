import { Grid } from "@radix-ui/themes";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import type { IPlaylist, ITrack } from "@/features/playlists/shared/domain";
import { RelativeScroll } from "@/shared/components";
import { useIsMounted } from "@/shared/hooks";
import type { IMatchedTrack } from "../domain";
import { MatchPlaylistRecommendations } from "./match-playlist-recommendations";
import { MatchPlaylistTrackList } from "./match-playlist-track-list";

export interface MatchPlaylistContentProps {
	defaultTrackId: string;
	matchedTracks: IMatchedTrack[];
	onBackHref: string;
	playlist: IPlaylist;
	setMatchedTracks: Dispatch<SetStateAction<IMatchedTrack[]>>;
}

export function MatchPlaylistContent({
	defaultTrackId,
	matchedTracks,
	playlist,
	setMatchedTracks,
}: MatchPlaylistContentProps) {
	const [currentlyMatchingTrackId, setCurrentlyMatchingTrackId] =
		useState(defaultTrackId);

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
		[
			currentlyMatchingTrackId,
			defaultTrackId,
			playlist.tracks,
			setMatchedTracks,
		],
	);

	const tracksContainerRef = useRef<HTMLDivElement>(null);
	const isMounted = useIsMounted();
	const anchorElement: HTMLElement | null = useMemo(() => {
		if (!isMounted) return null;
		return (
			tracksContainerRef.current?.querySelector(
				`[id="${currentMatchingTrack?.id}"]`,
			) ?? null
		);
	}, [currentMatchingTrack?.id, isMounted]);

	return (
		<Grid columns="60% 40%" gap="4" ref={tracksContainerRef}>
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
	);
}
