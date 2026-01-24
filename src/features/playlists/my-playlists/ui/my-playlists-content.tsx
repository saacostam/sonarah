import { Flex } from "@radix-ui/themes";
import type { IPaginatedPlaylists } from "@/features/playlists/shared/domain";
import { EmptyQuery } from "@/shared/components";
import { PlaylistItem } from "./playlist-item";

export interface MyPlaylistContentProps {
	pagination: IPaginatedPlaylists;
	onUnfollowPlaylist: (id: string) => void;
}

export function MyPlaylistContent({
	pagination,
	onUnfollowPlaylist,
}: MyPlaylistContentProps) {
	return (
		<main data-testid="my-playlists-content">
			{pagination.total > 0 ? (
				<Flex wrap="wrap" gap="3" width="100%" justify="center">
					{pagination.playlists.map((playlist) => (
						<PlaylistItem
							key={playlist.id}
							playlist={playlist}
							onUnfollow={() => onUnfollowPlaylist(playlist.id)}
						/>
					))}
				</Flex>
			) : (
				<EmptyQuery />
			)}
		</main>
	);
}
