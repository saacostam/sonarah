import { Flex, Heading } from "@radix-ui/themes";
import { useEffect } from "react";
import { DomainError, DomainErrorType } from "@/features/errors/domain";
import { QueryError } from "@/shared/components";
import { useQueryPlaylistById } from "../../hooks";
import { MatchPlaylistContent } from "./match-playlist-content";
import { MatchPlaylistSkeleton } from "./match-playlist-skeleton";

export interface MatchPlaylistProps {
	id: string;
	onNotFound: () => void;
}

export function MatchPlaylist({ id, onNotFound }: MatchPlaylistProps) {
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

	return (
		<>
			<Flex align="end" direction="row" justify="between" mb="4">
				<Heading>Match Playlist</Heading>
			</Flex>
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
				<MatchPlaylistContent playlist={playlistById.data.playlist} />
			)}
			{playlistById.isLoading && <MatchPlaylistSkeleton />}
		</>
	);
}
