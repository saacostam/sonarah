import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/shared/tests";
import { DashboardModalManagerContext } from "./app";
import type { IDashboardModalManager } from "./domain";
import { DashboardScreenContent } from "./ui";

function renderWithModalManager(
	..._args: Parameters<typeof renderWithProviders>
) {
	const [ui, ...args] = _args;
	const setStatus = vi.fn();

	const modalManager: IDashboardModalManager = {
		status: { type: "browse" },
		setStatus,
	};

	return {
		...renderWithProviders(
			<DashboardModalManagerContext.Provider value={modalManager}>
				{ui}
			</DashboardModalManagerContext.Provider>,
			...args,
		),
		setStatus,
	};
}

describe("DashboardScreenContent [Integration]", () => {
	it("should set create-status when 'Create' button is clicked", async () => {
		const { setStatus } = renderWithModalManager(<DashboardScreenContent />, {
			repositories: {
				playlist: {
					getAll: async () => ({
						total: 0,
						page: 0,
						playlists: [],
						limit: 0,
					}),
				},
			},
		});

		const createButton = await screen.findByRole("button", { name: /create/i });
		await userEvent.click(createButton);

		const expectedPayload: Parameters<IDashboardModalManager["setStatus"]>[0] =
			{
				type: "create-playlist",
			};

		expect(setStatus).toHaveBeenCalledWith(expectedPayload);
		expect(setStatus).toHaveBeenCalledTimes(1);
	});

	it("should set search-status when 'Import' button is clicked", async () => {
		const { setStatus } = renderWithModalManager(<DashboardScreenContent />, {
			repositories: {
				playlist: {
					getAll: async () => ({
						total: 0,
						page: 0,
						playlists: [],
						limit: 0,
					}),
				},
			},
		});

		const importButton = await screen.findByRole("button", { name: /import/i });
		await userEvent.click(importButton);

		const expectedPayload: Parameters<IDashboardModalManager["setStatus"]>[0] =
			{
				type: "search-playlist",
			};

		expect(setStatus).toHaveBeenCalledWith(expectedPayload);
		expect(setStatus).toHaveBeenCalledTimes(1);
	});
});
