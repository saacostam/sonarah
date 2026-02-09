import { Flex, Skeleton } from "@radix-ui/themes";

export function MyPlaylistsSkeleton() {
	return (
		<Flex
			gap="3"
			wrap="wrap"
			justify="center"
			data-testid="my-playlists-skeleton"
		>
			{new Array(14).fill(null).map((_, index) => (
				<Skeleton key={+index} width="9.5rem" height="13rem" />
			))}
		</Flex>
	);
}
