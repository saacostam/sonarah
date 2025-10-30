import { screen } from "@testing-library/react";
import { renderWithProviders } from "../tests";
import { Input } from "./input";

const mockRegister = () => ({
	name: "email",
	onChange: vi.fn(),
	onBlur: vi.fn(),
	ref: vi.fn(),
});

describe("Input", () => {
	it("renders label and error message when error is provided", () => {
		renderWithProviders(
			<Input label="Email" error="Invalid email" {...mockRegister()} />,
		);
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Invalid email")).toBeInTheDocument();
	});

	it("renders label and no error message when error is null", () => {
		renderWithProviders(
			<Input label="Email" error={null} {...mockRegister()} />,
		);
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
	});
});
