import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { IconProps } from "@/shared/icons";
import { Callout } from "./callout";

// Mocks
vi.mock("@/shared/icons", () => ({
	InformationCircleIcon: (props: IconProps) => (
		<svg data-testid="info-icon" {...props} />
	),
	XIcon: (props: IconProps) => <svg data-testid="close-icon" {...props} />,
}));

describe("Callout", () => {
	it("renders the callout content", () => {
		render(<Callout>Important message</Callout>);

		expect(screen.getByText("Important message")).toBeInTheDocument();
	});

	it("renders the default information icon when no icon is provided", () => {
		render(<Callout>Message</Callout>);

		expect(screen.getByTestId("info-icon")).toBeInTheDocument();
	});

	it("renders a custom icon when provided", () => {
		render(<Callout icon={<svg data-testid="custom-icon" />}>Message</Callout>);

		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
		expect(screen.queryByTestId("info-icon")).not.toBeInTheDocument();
	});

	it("renders a dismiss button by default", () => {
		render(<Callout>Message</Callout>);

		expect(screen.getByTestId("close-icon")).toBeInTheDocument();
	});

	it("does not render dismiss button when dismissable is false", () => {
		render(<Callout dismissable={false}>Message</Callout>);

		expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
	});

	it("internally dismisses the callout when close button is clicked", async () => {
		const user = userEvent.setup();

		render(<Callout>Dismiss me</Callout>);

		await user.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
		});
	});

	it("calls onDismiss when controlled dismissed prop is provided", async () => {
		const user = userEvent.setup();
		const onDismiss = vi.fn();

		render(
			<Callout dismissed={{ value: false, onDismiss }}>
				Controlled dismiss
			</Callout>,
		);

		await user.click(screen.getByRole("button"));

		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Controlled dismiss")).toBeInTheDocument();
	});

	it("does not render when dismissed.value is true", () => {
		render(
			<Callout dismissed={{ value: true, onDismiss: vi.fn() }}>
				Hidden content
			</Callout>,
		);

		expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
	});
});
