import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { renderWithProviders } from "@/tests";
import { UnfollowPlaylist } from "./unfollow-playlist";

describe("UnfollowPlaylist [Unit]", () => {
	const onCancel = vi.fn();
	const onSuccess = vi.fn();

	beforeEach(() => {
		onCancel.mockReset();
		onSuccess.mockReset();
	});

	it("should call onCancel when cancel button is clicked", async () => {
		renderWithProviders(
			// biome-ignore lint/correctness/useUniqueElementIds: Unit Test
			<UnfollowPlaylist
				id="test-id"
				onCancel={onCancel}
				onSuccess={onSuccess}
			/>,
			{
				adapters: {
					notificationsAdapter: {},
				},
				clients: {
					playlist: {},
				},
			},
		);

		const cancelButton = screen.getByRole("button", { name: /cancel/i });
		await userEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onSuccess).not.toHaveBeenCalled();
	});

	it("should successfully unfollow playlist", async () => {
		const unfollow = vi.fn();

		renderWithProviders(
			// biome-ignore lint/correctness/useUniqueElementIds: Unit Test
			<UnfollowPlaylist
				id="test-id"
				onCancel={onCancel}
				onSuccess={onSuccess}
			/>,
			{
				adapters: {
					notificationsAdapter: {},
				},
				clients: {
					playlist: {
						unfollow,
					},
				},
			},
		);

		unfollow.mockResolvedValueOnce({ id: "test-id" });

		const unfollowButton = screen.getByRole("button", { name: /unfollow/i });
		await userEvent.click(unfollowButton);

		await waitFor(() => {
			expect(unfollow).toHaveBeenCalledOnce();
			expect(unfollow).toHaveBeenCalledWith({ id: "test-id" });
		});

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalled();
		});
	});

	it("should handle errors when unfollowing playlist", async () => {
		const unfollow = vi.fn();
		const notify = vi.fn();

		renderWithProviders(
			// biome-ignore lint/correctness/useUniqueElementIds: Unit Test
			<UnfollowPlaylist
				id="test-id"
				onCancel={onCancel}
				onSuccess={onSuccess}
			/>,
			{
				adapters: {
					notificationsAdapter: {
						notify,
					},
				},
				clients: {
					playlist: {
						unfollow,
					},
				},
			},
		);

		unfollow.mockRejectedValue(
			new DomainError(DomainErrorType.BAD_REQUEST, "Error"),
		);

		const unfollowButton = screen.getByRole("button", { name: /unfollow/i });
		await userEvent.click(unfollowButton);

		await waitFor(() => {
			expect(unfollow).toHaveBeenCalledOnce();
			expect(unfollow).toHaveBeenCalledWith({ id: "test-id" });
		});

		await waitFor(() => {
			expect(onCancel).toHaveBeenCalled();
			expect(notify).toHaveBeenCalled();
			expect(onSuccess).not.toHaveBeenCalled();
		});
	});
});
