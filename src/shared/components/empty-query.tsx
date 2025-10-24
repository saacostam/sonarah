import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { CubeTransparentIcon } from "../icons";

export interface EmptyQueryProps {
	title?: string;
	description?: string;
}

export function EmptyQuery({
	title = "Nothing Here!",
	description = "Once something is available, it will be visible here",
}: EmptyQueryProps) {
	return (
		<Card>
			<Flex align="center" direction="column" gap="2">
				<CubeTransparentIcon height={64} width={64} />
				<Heading size="6">{title}</Heading>
				<Text style={{ color: "var(--gray-11)" }}>{description}</Text>
			</Flex>
		</Card>
	);
}
