import { Flex, Skeleton } from "@radix-ui/themes";

export function HomeScreenSkeleton() {
	return (
		<Flex direction="column" gap="4">
			<Flex gap="4">
				<Skeleton height="64px" width="100%" />
				<Skeleton height="64px" width="100%" />
			</Flex>
			<Skeleton height="256px" width="100%" />
			<Flex gap="4">
				<Skeleton height="64px" width="100%" />
				<Skeleton height="64px" width="100%" />
			</Flex>
		</Flex>
	);
}
