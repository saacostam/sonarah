import { Flex, Skeleton } from "@radix-ui/themes";

export function ProfileSkeleton() {
	return (
		<Flex gap="4" align="center">
			<Skeleton height="48px" width="48px" style={{ borderRadius: "100%" }} />
			<Flex direction="column" gap="2" flexGrow="1">
				<Skeleton height="16px" width="128px" />
				<Skeleton height="12px" width="128px" />
			</Flex>
		</Flex>
	);
}
