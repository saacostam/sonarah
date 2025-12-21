import { Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { Logo, PolymorphicButton } from "@/shared/components";

export interface ErrorScreenProps {
	resetHref: string;
}

export function ErrorScreen({ resetHref }: ErrorScreenProps) {
	return (
		<Container size="2">
			<Card my="4">
				<Flex align="center" direction="column" gap="6">
					<Logo />
					<Flex align="center" direction="column" gap="4">
						<Heading align="center" size="6">
							Page Not Found
						</Heading>
						<Heading align="center" size="8">
							404
						</Heading>
						<Text>Sorry, we couldn't find the page you're looking for.</Text>
					</Flex>
					<PolymorphicButton
						action={{
							action: { type: "href", href: resetHref },
							label: "Back To Home",
						}}
						size="3"
					/>
				</Flex>
			</Card>
		</Container>
	);
}
