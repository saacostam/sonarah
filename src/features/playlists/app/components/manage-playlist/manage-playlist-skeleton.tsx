import { Flex, Skeleton } from "@radix-ui/themes";

export function ManagePlaylistSkeleton() {
	return (
		<Flex direction="column" gap="4">
			<Flex gap="4" justify="between">
				<Skeleton height="32px" width="175px" />
				<Skeleton height="32px" width="200px" />
			</Flex>
			<Skeleton height="106px" width="100%" />
			<Skeleton height="24px" width="128px" mt="4" />
			<Flex direction="column" gap="2">
				<Skeleton height="72px" width="100%" />
				<Skeleton height="72px" width="100%" />
				<Skeleton height="72px" width="100%" />
				<Skeleton height="72px" width="100%" />
				<Skeleton height="72px" width="100%" />
			</Flex>
		</Flex>
	);
}
