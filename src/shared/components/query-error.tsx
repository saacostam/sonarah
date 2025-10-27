import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { getErrorMessage } from "../utils";

export interface QueryErrorProps {
	title: string;
	error: unknown;
	retry: {
		onClick: () => void;
		isPending: boolean;
	};
}

export function QueryError({ title, error, retry }: QueryErrorProps) {
	const description = getErrorMessage(
		error,
		"This may be due to a network issue or temporary server downtime. Please check your connection or try again in a moment.",
	);

	return (
		<Card
			data-testid="query-error"
			style={{ border: "var(--red-5) 1px solid", background: "var(--red-2)" }}
		>
			<Flex direction="column" gap="2">
				<Heading color="red" size="3">
					{title}
				</Heading>
				<Text size="2">{description}</Text>
				{retry && (
					<Button
						color="red"
						loading={retry.isPending}
						onClick={retry.onClick}
						style={{ cursor: "pointer", width: "fit-content" }}
					>
						Retry
					</Button>
				)}
			</Flex>
		</Card>
	);
}
