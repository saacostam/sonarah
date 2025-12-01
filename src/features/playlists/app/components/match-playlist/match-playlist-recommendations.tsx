import { Button, Flex, Tooltip } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type {
	ITrack,
	ITrackRepositoryPayload,
} from "@/features/playlists/domain";
import { TrackItem } from "../shared";

export interface MatchPlaylistRecommendationsProps {
	onClickRecommendation: (track: ITrack) => void;
	recommendations: ITrackRepositoryPayload["GetRecommendationsOut"];
}

export function MatchPlaylistRecommendations({
	onClickRecommendation,
	recommendations,
}: MatchPlaylistRecommendationsProps) {
	const [selectedPlaylistId, setSelectedPlaylistId] = useState<
		string | undefined
	>(recommendations.playlists.at(0)?.id);

	useEffect(() => {
		if (
			selectedPlaylistId === undefined &&
			recommendations.playlists.length > 0
		) {
			setSelectedPlaylistId(recommendations.playlists[0].id);
		}
	}, [recommendations.playlists, selectedPlaylistId]);

	if (!selectedPlaylistId) return null;

	const selectedPlaylist = recommendations.playlists.find(
		(p) => p.id === selectedPlaylistId,
	);

	return (
		<Flex direction="column" gap="2" width="100%">
			<Flex wrap="wrap" gap="2">
				{recommendations.playlists.map((playlist, index) => (
					<Tooltip key={playlist.id} content={playlist.name}>
						<Button
							variant={playlist.id === selectedPlaylistId ? "solid" : "outline"}
							onClick={() => setSelectedPlaylistId(playlist.id)}
							size="1"
						>
							Playlist {index + 1}
						</Button>
					</Tooltip>
				))}
			</Flex>

			{selectedPlaylist && (
				<Flex
					direction="column"
					gap="2"
					style={{ maxHeight: "350px", overflowY: "auto" }}
					key={selectedPlaylist.id}
				>
					{selectedPlaylist.tracks.map((track, index) => (
						<button
							key={track.id ?? index}
							className="clickable btn-reset"
							type="button"
							onClick={() => onClickRecommendation(track)}
						>
							<TrackItem track={track} order={index + 1} />
						</button>
					))}
				</Flex>
			)}
		</Flex>
	);
}
