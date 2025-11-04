import { Flex, Skeleton } from "@radix-ui/themes";

export function MyPlaylistsSkeleton() {
	return (
		<Flex
			gap="6"
			wrap="wrap"
			justify="center"
			data-testid="my-playlists-skeleton"
		>
			{new Array(14).fill(null).map((_, index) => (
				<Skeleton key={+index} width="8rem" height="10rem" />
			))}
		</Flex>
	);
}
