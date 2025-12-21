import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { renderWithProviders } from "@/tests";
import { QueryError } from "./query-error";

describe("QueryError [Integration]", () => {
	it("renders title and error message when an error is provided", () => {
		renderWithProviders(
			<QueryError
				title="Error loading data"
				error={
					new DomainError(DomainErrorType.BAD_REQUEST, "Something went wrong")
				}
				retry={{ onClick: vi.fn(), isPending: false }}
			/>,
		);

		expect(screen.getByText("Error loading data")).toBeInTheDocument();
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
	});

	it("renders fallback description when error is null", () => {
		renderWithProviders(
			<QueryError
				title="Network Error"
				error={null}
				retry={{ onClick: vi.fn(), isPending: false }}
			/>,
		);

		expect(screen.getByText("Network Error")).toBeInTheDocument();
		expect(
			screen.getByText(
				/This may be due to a network issue or temporary server downtime/i,
			),
		).toBeInTheDocument();
	});

	it("calls retry.onClick when Retry button is clicked", () => {
		const onClick = vi.fn();

		renderWithProviders(
			<QueryError
				title="Failed to load"
				error={new Error("Error")}
				retry={{ onClick, isPending: false }}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Retry" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("displays loading state when retry.isPending is true", async () => {
		renderWithProviders(
			<QueryError
				title="Loading Error"
				error={new Error("Loading failed")}
				retry={{ onClick: vi.fn(), isPending: true }}
			/>,
		);

		const button = screen.getByRole("button", { name: "Retry" });

		await waitFor(() => {
			expect(button).toHaveAttribute("data-disabled", "true");
			expect(button).toHaveAttribute("disabled", "");
		});
	});
});
