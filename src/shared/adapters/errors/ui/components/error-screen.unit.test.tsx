import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests";
import { ErrorScreen } from "./error-screen";

describe("ErrorScreen [Unit]", () => {
	it("renders headings, message and back button with correct link", () => {
		const resetHref = "/home";

		renderWithProviders(<ErrorScreen resetHref={resetHref} />);

		const button = screen.getByRole("link", { name: /back to home/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("href", resetHref);
	});
});
