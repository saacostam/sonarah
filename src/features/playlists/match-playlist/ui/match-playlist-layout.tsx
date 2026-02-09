import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { type PropsWithChildren, useCallback } from "react";
import type { IPlaylist } from "@/features/playlists/shared/domain";
import { PlaylistBrief } from "@/features/playlists/shared/ui";
import { WebPlayer } from "@/features/web-player/ui";
import { PolymorphicButton } from "@/shared/components";
import { ChevronLeftIcon, PlayIcon } from "@/shared/icons";
import { useMatchPlaylistModalManger } from "../app";
import type { IMatchedTrack } from "../domain";

export interface MatchPlaylistLayoutProps {
	matchedTracks: IMatchedTrack[];
	onBackHref: string;
	playlist: IPlaylist;
}

export function MatchPlaylistLayout({
	children,
	matchedTracks,
	onBackHref,
	playlist,
}: PropsWithChildren<MatchPlaylistLayoutProps>) {
	const { setStatus } = useMatchPlaylistModalManger();

	const onClickCreateHandler = useCallback(() => {
		setStatus({
			type: "create-playlist",
			uris: matchedTracks.map((match) => match.newTrack.uri),
		});
	}, [matchedTracks, setStatus]);

	const createStatus =
		matchedTracks.length === 0
			? "disabled"
			: matchedTracks.length === playlist.tracks.length
				? "highlighted"
				: "muted";

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
						color={createStatus === "highlighted" ? undefined : "yellow"}
						variant={createStatus === "highlighted" ? "solid" : "outline"}
						disabled={createStatus === "disabled"}
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
			<Box py="6">{children}</Box>
		</>
	);
}
