import { Button, Flex, Tooltip } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type {
	ITrack,
	ITrackRepositoryPayload,
} from "@/features/playlists/domain";
import { PlayIcon, PlusIcon } from "@/shared/icons";
import { useRepositories } from "@/shared/repositories/app";
import { TrackItem } from "../shared";

export interface MatchPlaylistRecommendationsProps {
	onClickRecommendation: (track: ITrack) => void;
	recommendations: ITrackRepositoryPayload["GetRecommendationsOut"];
}

export function MatchPlaylistRecommendations({
	onClickRecommendation,
	recommendations,
}: MatchPlaylistRecommendationsProps) {
	const { webPlayer } = useRepositories();

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
						<div key={track.id}>
							<TrackItem
								track={track}
								order={index + 1}
								rightSlot={
									<Flex direction="row" gap="1">
										<Tooltip content="Play Track">
											<Button
												onClick={() =>
													webPlayer.playTrackOfPlaylist({
														playlist: {
															uri: selectedPlaylist.uri,
															position: index,
														},
													})
												}
												size="1"
											>
												<PlayIcon height={12} width={12} />
											</Button>
										</Tooltip>
										<Tooltip content="Match Track">
											<Button
												onClick={() => onClickRecommendation(track)}
												size="1"
												color="green"
											>
												<PlusIcon height={12} width={12} />
											</Button>
										</Tooltip>
									</Flex>
								}
							/>
						</div>
					))}
				</Flex>
			)}
		</Flex>
	);
}
