import { Flex, Heading } from "@radix-ui/themes";
import type { IPlaylist } from "@/features/playlists/shared/domain";
import { PlaylistBrief, TrackItem } from "@/features/playlists/shared/ui";
import { EmptyQuery } from "@/shared/components";

export interface ManageMyPlaylistContentProps {
	playlist: IPlaylist;
}

export function ManageMyPlaylistContent({
	playlist,
}: ManageMyPlaylistContentProps) {
	return (
		<>
			<PlaylistBrief playlist={playlist} />
			<Heading mt="6" size="5">
				Tracks
			</Heading>
			<Flex direction="column" gap="2" wrap="nowrap" my="4">
				{playlist.tracks.length > 0 ? (
					playlist.tracks.map((track, index) => (
						<TrackItem key={track.id} track={track} order={index + 1} />
					))
				) : (
					<EmptyQuery description="Looks like this playlist is empty." />
				)}
			</Flex>
		</>
	);
}
