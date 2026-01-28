import { Flex, Grid, Skeleton, Spinner, TextField } from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import {
	useMutationSavePlaylist,
	useQuerySearchPlaylists,
} from "@/features/playlists/shared/app";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/shared/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { EmptyQuery, QueryError } from "@/shared/components";
import { PlaylistSearchItem } from "./playlist-search-item";

export interface SearchPlaylistProps {
	onError: (e: unknown) => void;
	onSuccess: (args: IPlaylistRepositoryPayload["SaveOut"]) => void;
}

const LIMIT = 20;

export function SearchPlaylist({ onError, onSuccess }: SearchPlaylistProps) {
	const { intersectionObserverAdapter } = useAdapters();

	const [search, setSearch] = useState<string>("");
	const [debouncedSearch] = useDebounce(search, 400);

	const [focusedPlaylistId, setFocusedPlaylistId] = useState<
		string | undefined
	>(undefined);

	const searchPlaylists = useQuerySearchPlaylists({
		req: {
			limit: LIMIT,
			q: debouncedSearch,
		},
		enabled: debouncedSearch !== "",
	});

	const { mutate: mutateSavePlaylist, isPending: mutateSaveIsPending } =
		useMutationSavePlaylist();

	const onAdd = useCallback(
		(id: string) => {
			mutateSavePlaylist(
				{ id },
				{
					onSuccess,
					onError,
				},
			);
		},
		[mutateSavePlaylist, onError, onSuccess],
	);

	const loadMoreRef = intersectionObserverAdapter.useOnInView(
		useCallback(
			(inView, entry) => {
				if (!searchPlaylists.hasNextPage || searchPlaylists.isFetchingNextPage)
					return;

				if (inView && entry.isIntersecting) {
					searchPlaylists.fetchNextPage();
				}
			},
			[searchPlaylists],
		),
		{
			root: null,
			rootMargin: "200px",
			threshold: 0.1,
		},
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
				) : searchPlaylists.isLoading ? (
					<Grid columns={{ xs: "1", md: "2" }} gap="2">
						{new Array(12).fill(null).map((_, index) => (
							<Skeleton key={+index} height="64px" width="100%" />
						))}
					</Grid>
				) : searchPlaylists.isSuccess ? (
					searchPlaylists.data.pages.length === 0 ? (
						<EmptyQuery />
					) : (
						<>
							<Grid columns={{ xs: "1", md: "2" }} gap="2">
								{searchPlaylists.data.pages.map((page) =>
									page.playlists.map((playlist, index) => (
										<PlaylistSearchItem
											key={playlist.id}
											isExpanded={focusedPlaylistId === playlist.id}
											isPending={mutateSaveIsPending}
											onAdd={onAdd}
											onCollapse={setFocusedPlaylistId}
											order={index + 1}
											playlist={playlist}
										/>
									)),
								)}
							</Grid>
							{searchPlaylists.isFetchingNextPage && (
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
						error={searchPlaylists.error}
						retry={{
							onClick: searchPlaylists.refetch,
							isPending: searchPlaylists.isFetching,
						}}
					/>
				)}
			</Flex>
		</Flex>
	);
}
