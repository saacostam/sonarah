import { Flex } from "@radix-ui/themes";
import type { IPaginatedPlaylists } from "@/features/playlists/domain";
import { EmptyQuery, Pagination } from "@/shared/components";
import { PlaylistItem } from "./playlist-item";

export interface MyPlaylistContentProps {
	pagination: IPaginatedPlaylists;
	setPage: (page: number) => void;
}

export function MyPlaylistContent({
	pagination,
	setPage,
}: MyPlaylistContentProps) {
	return (
		<main data-testid="my-playlists-content">
			{pagination.total > 0 ? (
				<>
					<Flex wrap="wrap" gap="3" width="100%" mb="6" justify="center">
						{pagination.playlists.map((playlist) => (
							<PlaylistItem key={playlist.id} playlist={playlist} />
						))}
					</Flex>
					<Pagination
						currentPage={pagination.page}
						dataTestId="my-playlist-pagination"
						setPage={setPage}
						totalPages={Math.ceil(pagination.total / pagination.limit)}
					/>
				</>
			) : (
				<EmptyQuery />
			)}
		</main>
	);
}
