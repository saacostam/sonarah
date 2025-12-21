import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./toast";

describe("Toast [Unit]", () => {
	it("should render title and description", () => {
		render(
			<Toast
				title="Success"
				description="Item saved successfully"
				onClose={vi.fn()}
			/>,
		);

		expect(screen.getByText("Success")).toBeInTheDocument();
		expect(screen.getByText("Item saved successfully")).toBeInTheDocument();
	});

	it("should call onClose when close button is clicked", async () => {
		const onClose = vi.fn();
		render(
			<Toast
				title="Error"
				description="Something went wrong"
				onClose={onClose}
			/>,
		);

		const button = screen.getByRole("button");
		await userEvent.click(button);

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
