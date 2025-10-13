import { Box, Container, Flex, Skeleton } from "@radix-ui/themes";
import { Logo, PolymorphicButton } from "@/shared/components";
import { useNavbar } from "../../app";

export function Navbar() {
	const { status, mainAction, secondaryAction } = useNavbar();

	return (
		<Box width="100%" style={{ borderBottom: "var(--accent-6) 1px solid" }}>
			<Container p="4">
				<Flex align="center" justify="between">
					<Logo />
					{status === "success" && (
						<Flex gap="4">
							<PolymorphicButton action={mainAction} />
							{secondaryAction && (
								<PolymorphicButton action={secondaryAction} variant="outline" />
							)}
						</Flex>
					)}
					{status === "loading" && <Skeleton height="32px" width="64px" />}
				</Flex>
			</Container>
		</Box>
	);
}
