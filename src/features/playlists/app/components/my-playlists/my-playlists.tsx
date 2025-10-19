import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { QueryError } from "@/shared/components";
import { useQueryMyPlaylists } from "../../hooks";
import { MyPlaylistsSkeleton } from "./my-playlists-skeleton";
import { PlaylistItem } from "./playlist-item";

const LIMIT = 14;

export function MyPlaylists() {
	const [page, setPage] = useState<number>(1);

	const myPlaylists = useQueryMyPlaylists({ req: { page, limit: LIMIT } });

	return (
		<main data-testid="my-playlists">
			<Box mb="6">
				<Heading>
					My Playlists{" "}
					{myPlaylists.isSuccess ? ` (${myPlaylists.data.total})` : null}
				</Heading>
				<Text>Select the playlist you want to reference</Text>
			</Box>
			{myPlaylists.isError && (
				<QueryError
					title="Unable to fetch my playlists"
					retry={{
						onClick: myPlaylists.refetch,
						isPending: myPlaylists.isPending,
					}}
				/>
			)}
			{myPlaylists.isLoading && <MyPlaylistsSkeleton />}
			{myPlaylists.isSuccess &&
				(myPlaylists.data.total > 0 ? (
					<>
						<Flex wrap="wrap" gap="6" width="100%" mb="6">
							{myPlaylists.data.playlists.map((playlist) => (
								<PlaylistItem key={playlist.id} playlist={playlist} />
							))}
						</Flex>
						<Flex
							gap="1"
							justify="center"
							style={{ margin: "auto" }}
							width="50%"
							wrap="wrap"
						>
							{new Array(Math.ceil(myPlaylists.data.total / LIMIT))
								.fill(null)
								.map((_, index) => {
									const buttonPage = index + 1;

									return (
										<Button
											key={+buttonPage}
											variant={buttonPage === page ? "solid" : "outline"}
											onClick={() => setPage(buttonPage)}
											style={{ cursor: "pointer" }}
										>
											{buttonPage}
										</Button>
									);
								})}
						</Flex>
					</>
				) : null)}
		</main>
	);
}
