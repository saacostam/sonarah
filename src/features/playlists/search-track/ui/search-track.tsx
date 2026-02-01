import { Flex, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuerySearchTracks } from "@/features/playlists/shared/app";
import { useAdapters } from "@/shared/adapters/core/app";
import { EmptyQuery, QueryError } from "@/shared/components";
import { SearchTrackContent } from "./search-track-content";
import { SearchTrackSkeleton } from "./search-track-skeleton";

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
	const { intersectionObserverAdapter } = useAdapters();

	const searchRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 400);

	const searchTracks = useQuerySearchTracks({
		req: {
			limit: LIMIT,
			q: debouncedSearch,
		},
		enabled: debouncedSearch !== "",
	});

	const loadMoreRef = intersectionObserverAdapter.useOnInView(
		useCallback(
			(inView, entry) => {
				if (!searchTracks.hasNextPage || searchTracks.isFetchingNextPage)
					return;

				if (inView && entry.isIntersecting) {
					searchTracks.fetchNextPage();
				}
			},
			[searchTracks],
		),
		{
			root: null,
			rootMargin: "200px",
			threshold: 0.1,
		},
	);

	useEffect(() => {
		if (searchRef.current) searchRef.current.focus();
	}, []);

	return (
		<Flex direction="column" gap="4">
			<TextField.Root
				value={search}
				aria-label="search"
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search..."
				ref={searchRef}
			/>
			<Flex direction="column" gap="2">
				{debouncedSearch === "" ? (
					<EmptyQuery
						title="Search"
						description="Add a keyword to start search"
					/>
				) : searchTracks.isLoading ? (
					<SearchTrackSkeleton />
				) : searchTracks.isSuccess ? (
					searchTracks.data.pages.length === 0 ||
					searchTracks.data.pages.at(0)?.tracks.length === 0 ? (
						<EmptyQuery />
					) : (
						<SearchTrackContent
							isFetchingNextPage={searchTracks.isFetchingNextPage}
							loadMoreRef={loadMoreRef}
							onError={onError}
							onSuccess={onSuccess}
							playlistId={playlistId}
							paginatedSearchTracks={searchTracks.data}
						/>
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
