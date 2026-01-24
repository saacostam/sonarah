import { useEffect } from "react";
import { useQueryPlaylistById } from "@/features/playlists/shared/app";
import { useQueryUser } from "@/features/user/app";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { QueryError } from "@/shared/components";
import { BrowseExternalPlaylistContent } from "./browse-external-playlist-content";
import { ManageMyPlaylistContent } from "./manage-my-playlist-content";
import { ManagePlaylistShell } from "./manage-playlist-shell";
import { ManagePlaylistSkeleton } from "./manage-playlist-skeleton";

export interface ManagePlaylistProps {
	id: string;
	onNextHref: string;
	onNotFound: () => void;
}

export function ManagePlaylist({
	id,
	onNextHref,
	onNotFound,
}: ManagePlaylistProps) {
	const playlistById = useQueryPlaylistById({
		req: {
			id,
		},
	});
	const user = useQueryUser();

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
			{(playlistById.isError || user.isError) && (
				<QueryError
					title="Unable to fetch playlist"
					error={playlistById.error}
					retry={{
						onClick: playlistById.refetch,
						isPending: playlistById.isFetching,
					}}
				/>
			)}
			{playlistById.isSuccess &&
				user.isSuccess &&
				(user.data.id === playlistById.data.playlist.creator.id ? (
					<ManagePlaylistShell title="Manage Playlist" onNextHref={onNextHref}>
						<ManageMyPlaylistContent playlist={playlistById.data.playlist} />
					</ManagePlaylistShell>
				) : (
					<ManagePlaylistShell title="Browse Playlist" onNextHref={onNextHref}>
						<BrowseExternalPlaylistContent
							playlist={playlistById.data.playlist}
						/>
					</ManagePlaylistShell>
				))}
			{(playlistById.isLoading || user.isLoading) && <ManagePlaylistSkeleton />}
		</>
	);
}
