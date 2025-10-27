import { Flex, Heading } from "@radix-ui/themes";
import type { IPlaylist } from "@/features/playlists/domain";
import { EmptyQuery } from "@/shared/components";
import { PlaylistBrief, TrackItem } from "../shared";

export interface ManagePlaylistContentProps {
	playlist: IPlaylist;
}

export function ManagePlaylistContent({
	playlist,
}: ManagePlaylistContentProps) {
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
