import { Box, Button, Container, Flex, Tooltip } from "@radix-ui/themes";
import { Link } from "react-router";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { Logo, PolymorphicButton } from "@/shared/components";
import { MoonIcon, SunIcon } from "@/shared/icons";
import { useNavbar } from "../../app";

export function Navbar() {
	const { mainAction, logoHref, theme, onToggleTheme } = useNavbar();

	return (
		<Box width="100%" style={{ borderBottom: "var(--gray-8) 1px solid" }}>
			<Container p="4">
				<Flex align="center" justify="between">
					<Button asChild variant="ghost">
						<Link to={logoHref}>
							<Logo />
						</Link>
					</Button>
					<Flex gap="2" align="center" justify="center">
						<Flex gap="4">
							<PolymorphicButton action={mainAction} />
						</Flex>
						<Tooltip content="Toggle Appearence">
							<Button
								onClick={onToggleTheme}
								variant="soft"
								aria-label="Toggle Appearance"
							>
								{theme === IThemeVariant.DARK ? (
									<SunIcon height={20} width={20} />
								) : (
									<MoonIcon height={20} width={20} />
								)}
							</Button>
						</Tooltip>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
