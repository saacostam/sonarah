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
				totalPages={3}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(3);
		expect(screen.getByTestId("pagination")).toBeInTheDocument();
	});

	it("applies 'solid' variant to the current page", () => {
		const setPage = vi.fn();

		render(
			<Pagination
				currentPage={2}
				dataTestId="pagination"
				setPage={setPage}
				totalPages={3}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		expect(
			buttons[1].getAttribute("data-state") || buttons[1].className,
		).toContain("solid");
	});

	it("calls setPage with the correct number when clicked", () => {
		const setPage = vi.fn();

		render(
			<Pagination
				currentPage={1}
				dataTestId="pagination"
				setPage={setPage}
				totalPages={3}
			/>,
		);

		const buttons = screen.getAllByRole("button");

		fireEvent.click(buttons[2]);
		expect(setPage).toHaveBeenCalledWith(3);

		fireEvent.click(buttons[0]);
		expect(setPage).toHaveBeenCalledWith(1);
	});
});
