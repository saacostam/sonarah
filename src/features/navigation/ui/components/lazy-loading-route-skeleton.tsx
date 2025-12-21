import { Flex, Skeleton } from "@radix-ui/themes";
import { AppLayout } from "@/shared/app-shell/ui";

export function LazyLoadingRouteSkeleton() {
	return (
		<AppLayout>
			<Flex direction="column" gap="4">
				<Flex justify="between" gap="4">
					<Flex direction="column" gap="4">
						<Skeleton height="28px" width="128px" />
						<Skeleton height="16px" width="256px" />
					</Flex>
					<Skeleton height="32px" width="64px" />
				</Flex>
				<Flex gap="4">
					<Skeleton
						height="64px"
						style={{ borderRadius: "100%" }}
						width="64px"
					/>
					<div style={{ flex: 1 }}>
						<Skeleton height="100%" width="100%" />
					</div>
				</Flex>
				<Skeleton height="128px" width="100%" />
				<Skeleton height="64px" width="100%" />
			</Flex>
		</AppLayout>
	);
}
