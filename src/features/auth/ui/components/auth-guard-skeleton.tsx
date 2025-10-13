import {
	Card,
	Container,
	Flex,
	Heading,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { Logo } from "@/shared/components";

export function AuthGuardSkeleton() {
	return (
		<Container size="1">
			<Card my="4">
				<Flex align="center" direction="column" gap="4">
					<Logo />
					<Heading align="center" size="6">
						Loading your Session...
					</Heading>
					<Text>Just a moment!</Text>
					<Spinner size="3" />
				</Flex>
			</Card>
		</Container>
	);
}
