import { Flex, Skeleton } from "@radix-ui/themes";

export function MatchPlaylistSkeleton() {
	return (
		<Flex direction="column" gap="4">
			<Skeleton height="24px" width="128px" mb="3" />
			<Skeleton height="106px" width="100%" />
		</Flex>
	);
}
