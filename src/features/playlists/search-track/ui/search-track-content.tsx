import { Flex, Grid, Spinner } from "@radix-ui/themes";
import type { InfiniteData } from "@tanstack/react-query";
import { type Ref, useCallback } from "react";
import { useMutationAddItemToPlaylist } from "../../shared/app";
import type { ITrackRepositoryPayload } from "../../shared/domain";
import { SearchTrackItem } from "./search-track-item";

export interface SearchTrackContentProps {
	isFetchingNextPage: boolean;
	loadMoreRef: Ref<HTMLDivElement>;
	onError: (e: unknown) => void;
	onSuccess: () => void;
	paginatedSearchTracks: InfiniteData<ITrackRepositoryPayload["SearchOut"]>;
	playlistId: string;
}

export function SearchTrackContent({
	isFetchingNextPage,
	loadMoreRef,
	onError,
	onSuccess,
	paginatedSearchTracks,
	playlistId,
}: SearchTrackContentProps) {
	const addItemsToPlaylist = useMutationAddItemToPlaylist();
	const { mutate: mutateAddItemsToPlaylist } = addItemsToPlaylist;

	const onAdd = useCallback(
		(uri: string) => {
			mutateAddItemsToPlaylist(
				{
					id: playlistId,
					uris: [uri],
				},
				{
					onSuccess,
					onError,
				},
			);
		},
		[mutateAddItemsToPlaylist, onError, onSuccess, playlistId],
	);

	return (
		<main data-testid="search-track-content">
			<Grid columns={{ xs: "1", md: "2" }} gap="2">
				{paginatedSearchTracks.pages.map((page) =>
					page.tracks.map((track, index) => (
						<SearchTrackItem
							key={track.id}
							isPending={addItemsToPlaylist.isPending}
							onAdd={onAdd}
							order={index + 1}
							track={track}
						/>
					)),
				)}
			</Grid>
			{isFetchingNextPage && (
				<Flex justify="center">
					<Spinner my="1" size="3" />
				</Flex>
			)}
			{/* 👇 Sentinel for observer */}
			<div ref={loadMoreRef} style={{ height: "1px" }} />
		</main>
	);
}
