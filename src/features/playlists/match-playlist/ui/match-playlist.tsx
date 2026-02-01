import { useEffect } from "react";
import { useQueryPlaylistById } from "@/features/playlists/shared/app";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { QueryError } from "@/shared/components";
import { MatchPlaylistContent } from "./match-playlist-content";
import { MatchPlaylistSkeleton } from "./match-playlist-skeleton";

export interface MatchPlaylistProps {
	id: string;
	onBackHref: string;
	onNotFound: () => void;
}

export function MatchPlaylist({
	id,
	onBackHref,
	onNotFound,
}: MatchPlaylistProps) {
	const queryPlaylistById = useQueryPlaylistById({
		req: {
			id,
		},
	});
	const playlistById = queryPlaylistById.useQuery();

	useEffect(
		function redirectIfNotFound() {
			if (playlistById.isError) {
				if (
					playlistById.error instanceof DomainError &&
					playlistById.error.type === DomainErrorType.NOT_FOUND
				) {
					onNotFound();
				}
			}
		},
		[playlistById.error, playlistById.isError, onNotFound],
	);

	return (
		<>
			{playlistById.isError && (
				<QueryError
					title="Unable to fetch playlist"
					error={playlistById.error}
					retry={{
						onClick: playlistById.refetch,
						isPending: playlistById.isFetching,
					}}
				/>
			)}
			{playlistById.isSuccess && (
				<MatchPlaylistContent
					onBackHref={onBackHref}
					playlist={playlistById.data.playlist}
				/>
			)}
			{playlistById.isLoading && <MatchPlaylistSkeleton />}
		</>
	);
}
