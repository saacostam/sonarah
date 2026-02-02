import { Flex, Skeleton } from "@radix-ui/themes";
import { useMemo } from "react";

const N = 5;

export function ManagePlaylistSkeleton() {
	const items = useMemo(
		() =>
			new Array(N)
				.fill(null)
				.map((_, index) => (
					<Skeleton key={+index} height="72px" width="100%" />
				)),
		[],
	);

	return (
		<Flex data-testid="manage-playlist-skeleton" direction="column" gap="4">
			<Flex gap="4" justify="between">
				<Skeleton height="32px" width="175px" />
				<Skeleton height="32px" width="200px" />
			</Flex>
			<Skeleton height="32px" width="160px" />
			<Skeleton height="102px" width="100%" />
			<Flex direction="column" gap="2" mt="4">
				<Skeleton height="24px" width="128px" />
				<Skeleton height="16px" width="256px" />
			</Flex>
			<Flex direction="column" gap="2">
				{items}
			</Flex>
		</Flex>
	);
}
