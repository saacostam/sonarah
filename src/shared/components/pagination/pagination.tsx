import { Button, Flex, Text } from "@radix-ui/themes";

export interface PaginationProps {
	currentPage: number;
	dataTestId: string;
	setPage: (page: number) => void;
	itemsPerPage: number;
	totalItems: number;
}

export function Pagination({
	currentPage,
	dataTestId,
	setPage,
	itemsPerPage,
	totalItems,
}: PaginationProps) {
	const l = Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems);
	const r = Math.min(itemsPerPage * currentPage, totalItems);

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	return (
		<Flex
			align="center"
			direction="column"
			gap="2"
			style={{ margin: "auto" }}
			width="50%"
		>
			<Flex gap="1" justify="center" wrap="wrap" data-testid={dataTestId}>
				{new Array(totalPages).fill(null).map((_, index) => {
					const buttonPage = index + 1;

					return (
						<Button
							key={+buttonPage}
							variant={buttonPage === currentPage ? "solid" : "outline"}
							onClick={() => setPage(buttonPage)}
							style={{ cursor: "pointer" }}
						>
							{buttonPage}
						</Button>
					);
				})}
			</Flex>
			<Text color="gray" size="2">
				Showing {l}-{r} of {totalItems}
			</Text>
		</Flex>
	);
}
