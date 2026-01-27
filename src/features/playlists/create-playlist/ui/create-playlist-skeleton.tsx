import { Box, Flex, Skeleton } from "@radix-ui/themes";

export function CreatePlaylistSkeleton() {
	return (
		<Flex data-testid="create-playlist-skeleton" direction="column" gap="4">
			<Box>
				<Skeleton width="128px" height="24px" mb="2" />
				<Skeleton width="100%" height="32px" />
			</Box>
			<Flex gap="2" justify="end">
				<Skeleton width="64px" height="32px" />
				<Skeleton width="64px" height="32px" />
			</Flex>
		</Flex>
	);
}
