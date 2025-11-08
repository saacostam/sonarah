import { Button, Flex } from "@radix-ui/themes";

export interface PaginationProps {
	currentPage: number;
	dataTestId: string;
	setPage: (page: number) => void;
	totalPages: number;
}

export function Pagination({
	currentPage,
	dataTestId,
	setPage,
	totalPages,
}: PaginationProps) {
	return (
		<Flex
			gap="1"
			justify="center"
			style={{ margin: "auto" }}
			width="50%"
			wrap="wrap"
			data-testid={dataTestId}
		>
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
	);
}
