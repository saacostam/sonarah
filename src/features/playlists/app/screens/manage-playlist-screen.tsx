import { Flex, Skeleton } from "@radix-ui/themes";
import { useRouter } from "@/features/router/app";

export function ManagePlaylistScreen() {
	const router = useRouter();
	const { id } = router.getParams();

	return id ? (
		<Flex direction="column" gap="4">
			<Skeleton height="24px" width="128px" />
			<Skeleton height="128px" width="100%" />
		</Flex>
	) : (
		<Flex direction="column" gap="4">
			<Skeleton height="24px" width="128px" />
			<Skeleton height="128px" width="100%" />
		</Flex>
	);
}
