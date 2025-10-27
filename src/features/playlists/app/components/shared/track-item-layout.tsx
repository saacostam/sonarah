import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";

export interface TrackItemLayoutProps {
	avatar: {
		fallback: string;
		src?: string;
	};
	header: string;
	subheader: string;
	highlighted: boolean;
}

export function TrackItemLayout({
	avatar,
	header,
	subheader,
	highlighted,
}: TrackItemLayoutProps) {
	return (
		<Card
			style={
				highlighted
					? {
							backgroundColor: "var(--accent-6)",
						}
					: {}
			}
		>
			<Flex direction="row" gap="4" wrap="wrap">
				<Avatar fallback={avatar.fallback} src={avatar.src} size="4" />
				<Flex direction="column" gap="2" style={{ flex: 1, minWidth: 0 }}>
					<Heading size="3" truncate>
						{header}
					</Heading>
					<Text size="2" truncate style={{ color: "var(--gray-11)" }}>
						{subheader}
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
