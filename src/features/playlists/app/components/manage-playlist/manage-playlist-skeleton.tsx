import { Flex, Skeleton } from "@radix-ui/themes";

export function ManagePlaylistSkeleton() {
	return (
		<Flex direction="column" gap="4">
			<Skeleton height="24px" width="128px" />
			<Skeleton height="128px" width="100%" />
		</Flex>
	);
}
