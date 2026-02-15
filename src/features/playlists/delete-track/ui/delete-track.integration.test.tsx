import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { renderWithProviders } from "@/tests";
import { DeleteTrack } from "./delete-track";

describe("DeleteTrack (client integration)", () => {
	const playlistId = "playlist-1";
	const trackUri = "spotify:track:123";

	function setup({
		removeItemsFromPlaylist,
	}: {
		removeItemsFromPlaylist: ReturnType<typeof vi.fn>;
	}) {
		const onClose = vi.fn();
		const onSuccess = vi.fn();
		const onError = vi.fn();

		renderWithProviders(
			<DeleteTrack
				onClose={onClose}
				onError={onError}
				onSuccess={onSuccess}
				playlistId={playlistId}
				trackUri={trackUri}
			/>,
			{
				clients: {
					playlist: {
						removeItemsFromPlaylist,
					},
				},
			},
		);

		return { onClose, onSuccess, onError };
	}

	it("calls client removeItemsFromPlaylist with correct payload and triggers callbacks", async () => {
		const removeItemsFromPlaylist = vi.fn().mockResolvedValue(undefined);

		const { onClose, onSuccess, onError } = setup({
			removeItemsFromPlaylist,
		});

		await userEvent.click(screen.getByRole("button", { name: "Delete" }));

		await waitFor(() => {
			expect(removeItemsFromPlaylist).toHaveBeenCalledTimes(1);
		});

		expect(removeItemsFromPlaylist).toHaveBeenCalledWith({
			id: playlistId,
			uris: [trackUri],
		});

		expect(onSuccess).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onError).not.toHaveBeenCalled();
	});

	it("calls onError and onClose when mutation fails", async () => {
		const error = new DomainError(
			DomainErrorType.APP_ERROR,
			"User Message",
			"Error",
		);

		const removeItemsFromPlaylist = vi.fn().mockRejectedValue(error);

		const { onClose, onSuccess, onError } = setup({
			removeItemsFromPlaylist,
		});

		await userEvent.click(screen.getByRole("button", { name: "Delete" }));

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onSuccess).not.toHaveBeenCalled();
	});
});
