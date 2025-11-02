import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { INotificationAdapterType } from "../../domain";
import { ReactHotToastNotificationAdapter } from "./react-hot-toast-notification-adapter";

vi.mock("react-hot-toast", () => ({
	default: {
		error: vi.fn(),
		success: vi.fn(),
		dismiss: vi.fn(),
	},
}));

vi.mock("../../ui", () => ({
	Toast: vi.fn(() => null),
}));

describe("ReactHotToastNotificationAdapter [Unit]", () => {
	let adapter: ReactHotToastNotificationAdapter;

	beforeEach(() => {
		adapter = new ReactHotToastNotificationAdapter();
		vi.clearAllMocks();
	});

	it("should call toast.error when type is ERROR", async () => {
		const mockReturn = "error-toast-id";
		(toast.error as Mock).mockReturnValue(mockReturn);

		await adapter.notify(
			INotificationAdapterType.ERROR,
			"Error Title",
			"Something went wrong",
		);

		expect(toast.error).toHaveBeenCalledTimes(1);
	});

	it("should call toast.success when type is SUCCESS", async () => {
		const mockReturn = "success-toast-id";
		(toast.success as Mock).mockReturnValue(mockReturn);

		await adapter.notify(
			INotificationAdapterType.SUCCESS,
			"Success Title",
			"Operation completed",
		);

		expect(toast.success).toHaveBeenCalledTimes(1);
	});
});
