import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

describe("Pagination", () => {
	it("renders the correct number of buttons", () => {
		const setPage = vi.fn();

		render(
			<Pagination
				currentPage={1}
				dataTestId="pagination"
				setPage={setPage}
				totalItems={12}
				itemsPerPage={4}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(3);
		expect(screen.getByTestId("pagination")).toBeInTheDocument();
		expect(screen.getByText("Showing 1-4 of 12")).toBeInTheDocument();
	});

	it("applies 'solid' variant to the current page", () => {
		const setPage = vi.fn();

		render(
			<Pagination
				currentPage={2}
				dataTestId="pagination"
				setPage={setPage}
				totalItems={12}
				itemsPerPage={4}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		expect(
			buttons[1].getAttribute("data-state") || buttons[1].className,
		).toContain("solid");
		expect(screen.getByText("Showing 5-8 of 12")).toBeInTheDocument();
	});

	it("calls setPage with the correct number when clicked", async () => {
		const setPage = vi.fn();

		render(
			<Pagination
				currentPage={1}
				dataTestId="pagination"
				setPage={setPage}
				totalItems={12}
				itemsPerPage={4}
			/>,
		);

		const buttons = screen.getAllByRole("button");

		fireEvent.click(buttons[2]);
		expect(setPage).toHaveBeenCalledWith(3);

		fireEvent.click(buttons[0]);
		expect(setPage).toHaveBeenCalledWith(1);
	});
});

describe("Pagination – l-r total copy", () => {
	const cases = [
		{
			name: "first page",
			currentPage: 1,
			itemsPerPage: 5,
			totalItems: 20,
			expected: "Showing 1-5 of 20",
		},
		{
			name: "middle page",
			currentPage: 3,
			itemsPerPage: 5,
			totalItems: 20,
			expected: "Showing 11-15 of 20",
		},
		{
			name: "last full page",
			currentPage: 4,
			itemsPerPage: 5,
			totalItems: 20,
			expected: "Showing 16-20 of 20",
		},
		{
			name: "partially filled last page",
			currentPage: 3,
			itemsPerPage: 4,
			totalItems: 10,
			expected: "Showing 9-10 of 10",
		},
		{
			name: "totalItems smaller than itemsPerPage",
			currentPage: 1,
			itemsPerPage: 10,
			totalItems: 3,
			expected: "Showing 1-3 of 3",
		},
		{
			name: "handle 0 items",
			currentPage: 1,
			itemsPerPage: 1,
			totalItems: 0,
			expected: "Showing 0-0 of 0",
		},
	];

	it.each(cases)(
		"$name",
		({ currentPage, itemsPerPage, totalItems, expected }) => {
			render(
				<Pagination
					currentPage={currentPage}
					dataTestId="pagination"
					setPage={vi.fn()}
					itemsPerPage={itemsPerPage}
					totalItems={totalItems}
				/>,
			);

			expect(screen.getByText(expected)).toBeInTheDocument();
		},
	);
});
