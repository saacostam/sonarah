import { Box, Button, Container, Flex, Skeleton } from "@radix-ui/themes";
import { Link } from "react-router";
import { Logo, PolymorphicButton } from "@/shared/components";
import { useNavbar } from "../../app";

export function Navbar() {
	const {
		loader: { status, mainAction, secondaryAction },
		logoHref,
	} = useNavbar();

	return (
		<Box width="100%" style={{ borderBottom: "var(--gray-8) 1px solid" }}>
			<Container p="4">
				<Flex align="center" justify="between">
					<Button asChild variant="ghost">
						<Link to={logoHref}>
							<Logo />
						</Link>
					</Button>
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
