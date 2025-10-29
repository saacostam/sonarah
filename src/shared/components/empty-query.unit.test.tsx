import { screen } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../tests";
import { EmptyQuery } from "./empty-query";

describe("EmptyQuery [Unit]", () => {
	it("renders with default title and description", () => {
		renderWithProviders(<EmptyQuery />);

		expect(screen.getByText("Nothing Here!")).toBeInTheDocument();
		expect(
			screen.getByText("Once something is available, it will be visible here"),
		).toBeInTheDocument();
	});

	it("renders with custom title and description", () => {
		renderWithProviders(
			<EmptyQuery title="No Results" description="Try another search" />,
		);

		expect(screen.getByText("No Results")).toBeInTheDocument();
		expect(screen.getByText("Try another search")).toBeInTheDocument();
	});
});
