import { Pagination } from "@/shared/components";
import { useQueryMyPlaylists } from "../../hooks";

export interface MyPlaylistPaginationProps {
	page: number;
	paginationLimit: number;
	setPage: (page: number) => void;
}

export function MyPlaylistPagination({
	page,
	paginationLimit,
	setPage,
}: MyPlaylistPaginationProps) {
	const myPlaylists = useQueryMyPlaylists({
		req: { page: 1, limit: paginationLimit },
	});

	if (!myPlaylists.isSuccess) return null;

	return (
		<Pagination
			currentPage={page}
			dataTestId="my-playlist-pagination"
			setPage={setPage}
			itemsPerPage={myPlaylists.data.limit}
			totalItems={myPlaylists.data.total}
		/>
	);
}
