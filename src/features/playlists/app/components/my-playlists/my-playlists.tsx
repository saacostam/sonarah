import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { QueryError } from "@/shared/components";
import { ArrowDownTrayIcon, PlusIcon } from "@/shared/icons";
import { useQueryMyPlaylists } from "../../hooks";
import { MyPlaylistContent } from "./my-playlists-content";
import { MyPlaylistsSkeleton } from "./my-playlists-skeleton";

const LIMIT = 14;

export interface MyPlaylistsProps {
	onCreatePlaylist: () => void;
	onSearchPlaylist: () => void;
}

export function MyPlaylists({
	onCreatePlaylist,
	onSearchPlaylist,
}: MyPlaylistsProps) {
	const [page, setPage] = useState<number>(1);

	const myPlaylists = useQueryMyPlaylists({ req: { page, limit: LIMIT } });

	return (
		<main>
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
				<MyPlaylistContent pagination={myPlaylists.data} setPage={setPage} />
			)}
		</main>
	);
}
