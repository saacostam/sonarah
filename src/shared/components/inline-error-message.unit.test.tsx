import { screen } from "@testing-library/react";
import { renderWithProviders } from "../tests";
import { InlineErrorMessage } from "./inline-error-message";

describe("InlineErrorMessage [Unit]", () => {
	it("renders children text", () => {
		renderWithProviders(
			<InlineErrorMessage>Something went wrong</InlineErrorMessage>,
		);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});
});
