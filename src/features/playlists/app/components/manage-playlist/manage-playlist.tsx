import { Flex, Heading, Tooltip } from "@radix-ui/themes";
import { useEffect } from "react";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { PolymorphicButton, QueryError } from "@/shared/components";
import { PlayIcon } from "@/shared/icons";
import { useQueryPlaylistById } from "../../hooks";
import { ManagePlaylistContent } from "./manage-playlist-content";
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
				<Heading>Manage Playlist</Heading>
				<Tooltip content="Move on to create your playlist based on this reference.">
					<PolymorphicButton
						action={{
							action: {
								type: "href",
								href: onNextHref,
							},
							label: (
								<>
									<PlayIcon width={16} height={16} />
									Next: Build Your Playlist
								</>
							),
						}}
					/>
				</Tooltip>
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
				<ManagePlaylistContent playlist={playlistById.data.playlist} />
			)}
			{playlistById.isLoading && <ManagePlaylistSkeleton />}
		</>
	);
}
