import { useEffect } from "react";
import { DomainError, DomainErrorType } from "@/features/errors/domain";
import { QueryError } from "@/shared/components";
import { useQueryPlaylistById } from "../../hooks";
import { ManagePlaylistContent } from "./manage-playlist-content";
import { ManagePlaylistSkeleton } from "./manage-playlist-skeleton";

export interface ManagePlaylistProps {
	id: string;
	onNotFound: () => void;
}

export function ManagePlaylist({ id, onNotFound }: ManagePlaylistProps) {
	const playlistById = useQueryPlaylistById({
		req: {
			id,
		},
	});

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

	if (playlistById.isError)
		return (
			<QueryError title="Unable to fetch playlist" error={playlistById.error} />
		);
	if (playlistById.isSuccess)
		return <ManagePlaylistContent playlist={playlistById.data.playlist} />;

	return <ManagePlaylistSkeleton />;
}
