import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { QueryError } from "@/shared/components";
import { ArrowDownTrayIcon, PlusIcon } from "@/shared/icons";
import { useQueryMyPlaylists } from "../../hooks";
import { MyPlaylistContent } from "./my-playlists-content";
import { MyPlaylistPagination } from "./my-playlists-pagination";
import { MyPlaylistsSkeleton } from "./my-playlists-skeleton";

export interface MyPlaylistsProps {
	onCreatePlaylist: () => void;
	onSearchPlaylist: () => void;
	onUnfollowPlaylist: (id: string) => void;
	page: number;
	paginationLimit: number;
	setPage: (page: number) => void;
}

export function MyPlaylists({
	onCreatePlaylist,
	onSearchPlaylist,
	onUnfollowPlaylist,
	page,
	paginationLimit,
	setPage,
}: MyPlaylistsProps) {
	const myPlaylists = useQueryMyPlaylists({
		req: { page, limit: paginationLimit },
	});

	return (
		<>
			<Box mb="6">
				<Flex
					mb="6"
					direction={{ initial: "column", xs: "row" }}
					gap="4"
					justify="between"
				>
					<div>
						<Heading>
							My Playlists{" "}
							{myPlaylists.isSuccess ? ` (${myPlaylists.data.total})` : null}
						</Heading>
						<Text>Select the playlist you want to reference</Text>
					</div>
					<Flex gap="2">
						<Button
							onClick={onSearchPlaylist}
							style={{ cursor: "pointer" }}
							variant="outline"
						>
							<ArrowDownTrayIcon height={16} width={16} /> Import
						</Button>

						<Button onClick={onCreatePlaylist} style={{ cursor: "pointer" }}>
							<PlusIcon height={16} width={16} /> Create
						</Button>
					</Flex>
				</Flex>
				{myPlaylists.isError && (
					<QueryError
						error={myPlaylists.error}
						title="Unable to fetch my playlists"
						retry={{
							onClick: myPlaylists.refetch,
							isPending: myPlaylists.isPending,
						}}
					/>
				)}
				{myPlaylists.isLoading && <MyPlaylistsSkeleton />}
				{myPlaylists.isSuccess && (
					<MyPlaylistContent
						onUnfollowPlaylist={onUnfollowPlaylist}
						pagination={myPlaylists.data}
					/>
				)}
			</Box>
			<MyPlaylistPagination
				page={page}
				paginationLimit={paginationLimit}
				setPage={setPage}
			/>
		</>
	);
}
