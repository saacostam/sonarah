import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { getErrorMessage } from "../utils";
import { PolymorphicButton } from "./polymorphic-button";

export interface QueryErrorProps {
	title: string;
	error: unknown;
	retry?: {
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
					<PolymorphicButton
						action={{
							label: "Retry",
							action: {
								type: "button",
								onClick: retry.onClick,
							},
						}}
						style={{ width: "fit-content" }}
						loading={retry.isPending}
					/>
				)}
			</Flex>
		</Card>
	);
}
