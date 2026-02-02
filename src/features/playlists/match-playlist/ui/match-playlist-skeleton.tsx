import { Flex, Skeleton } from "@radix-ui/themes";
import { useMemo } from "react";

const N = 5;

export function MatchPlaylistSkeleton() {
	const items = useMemo(
		() =>
			new Array(N)
				.fill(null)
				.map((_, index) => (
					<Skeleton key={+index} height="64px" width="100%" />
				)),
		[],
	);

	return (
		<Flex data-testid="match-playlist-skeleton" direction="column" gap="4">
			<Skeleton height="32px" width="128px" mb="1" />
			<Skeleton height="24px" width="128px" mb="1" />
			<Skeleton height="100px" width="100%" mb="5" />
			<Skeleton height="24px" width="128px" mb="1" />
			<Flex direction="column" gap="2">
				{items}
			</Flex>
		</Flex>
	);
}
