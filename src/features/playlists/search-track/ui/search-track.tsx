import { Flex, Grid, Skeleton, Spinner, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import {
	useMutationAddItemToPlaylist,
	useQuerySearchTracks,
} from "@/features/playlists/shared/app";
import { EmptyQuery, QueryError } from "@/shared/components";
import { SearchTrackItem } from "./search-track-item";

export interface SearchTrackProps {
	onError: (e: unknown) => void;
	onSuccess: () => void;
	playlistId: string;
}

const LIMIT = 20;

export function SearchTrack({
	onError,
	onSuccess,
	playlistId,
}: SearchTrackProps) {
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 400);

	const searchTracks = useQuerySearchTracks({
		req: {
			limit: LIMIT,
			q: debouncedSearch,
		},
		enabled: debouncedSearch !== "",
	});

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

	const loadMoreRef = useRef<HTMLDivElement | null>(null);
	useEffect(
		function setupIntersectionObserverForInfiniteScrolling() {
			if (!loadMoreRef.current) return;
			if (!searchTracks.hasNextPage || searchTracks.isFetchingNextPage) return;

			const observer = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (entry.isIntersecting) {
						searchTracks.fetchNextPage();
					}
				},
				{
					root: null, // viewport
					rootMargin: "200px", // start loading before fully visible
					threshold: 0.1,
				},
			);

			observer.observe(loadMoreRef.current);

			return () => observer.disconnect();
		},
		[searchTracks],
	);

	return (
		<Flex direction="column" gap="4">
			<TextField.Root
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search..."
			/>
			<Flex direction="column" gap="2">
				{debouncedSearch === "" ? (
					<EmptyQuery
						title="Search"
						description="Add a keyword to start search"
					/>
				) : searchTracks.isLoading ? (
					<Grid columns={{ xs: "1", md: "2" }} gap="2">
						{new Array(12).fill(null).map((_, index) => (
							<Skeleton key={+index} height="64px" width="100%" />
						))}
					</Grid>
				) : searchTracks.isSuccess ? (
					searchTracks.data.pages.length === 0 ? (
						<EmptyQuery />
					) : (
						<>
							<Grid columns={{ xs: "1", md: "2" }} gap="2">
								{searchTracks.data.pages.map((page) =>
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
							{searchTracks.isFetchingNextPage && (
								<Flex justify="center">
									<Spinner my="1" size="3" />
								</Flex>
							)}
							{/* 👇 Sentinel for observer */}
							<div ref={loadMoreRef} style={{ height: "1px" }} />
						</>
					)
				) : (
					<QueryError
						title="Invalid Search"
						error={searchTracks.error}
						retry={{
							onClick: searchTracks.refetch,
							isPending: searchTracks.isFetching,
						}}
					/>
				)}
			</Flex>
		</Flex>
	);
}
