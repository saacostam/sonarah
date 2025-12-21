import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests";
import { PolymorphicButton } from "./polymorphic-button";

describe("PolymorphicButton", () => {
	it("renders as a Link when action type is href", () => {
		renderWithProviders(
			<PolymorphicButton
				action={{
					label: "Go Home",
					action: { type: "href", href: "/home" },
				}}
			/>,
		);

		const link = screen.getByRole("link", { name: "Go Home" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/home");
	});

	it("renders as a button and triggers onClick when action type is button", () => {
		const handleClick = vi.fn();

		renderWithProviders(
			<PolymorphicButton
				action={{
					label: "Click Me",
					action: { type: "button", onClick: handleClick },
				}}
			/>,
		);

		const button = screen.getByRole("button", { name: "Click Me" });
		expect(button).toBeInTheDocument();

		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("passes additional props to the underlying Button", () => {
		renderWithProviders(
			<PolymorphicButton
				action={{
					label: "Disabled Button",
					action: { type: "button", onClick: vi.fn() },
				}}
				disabled
				aria-label="custom-button"
				data-testid="custom-button"
			/>,
		);

		const button = screen.getByTestId("custom-button");
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-label", "custom-button");
	});
});
