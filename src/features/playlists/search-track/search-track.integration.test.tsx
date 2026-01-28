import { screen, waitFor, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type {
	IPlaylistRepositoryPayload,
	ITrackRepositoryPayload,
} from "@/features/playlists/shared/domain";
import { createIntersectionObserverAdapterMock } from "@/shared/test";
import { renderWithProviders } from "@/tests";
import { SearchTrack } from "./ui";

describe("Search Track [Integration Test]", () => {
	describe("should search using word typed by user", () => {
		it("should render search items", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

			const addItems = vi.fn();
			const search = vi.fn();

			const intersectionObserverAdapter =
				createIntersectionObserverAdapterMock();

			renderWithProviders(
				<SearchTrack
					onError={onError}
					onSuccess={onSuccess}
					playlistId="playlist-test-id"
				/>,
				{
					adapters: {
						intersectionObserverAdapter: intersectionObserverAdapter.adapter,
					},
					repositories: {
						playlist: {
							addItems,
						},
						track: {
							search,
						},
					},
				},
			);

			const input = screen.getByRole("textbox", { name: "search" });
			userEvent.type(input, "keyword");

			// Search Request
			const searchExpectedResponse: ITrackRepositoryPayload["SearchOut"] = {
				page: 1,
				limit: 20,
				tracks: [
					{
						id: "test-id-1",
						name: "test-name-1",
						artistNames: ["test-artist-name-1"],
						durationInMs: 3500,
						uri: "test-uri-1",
					},
					{
						id: "test-id-2",
						name: "test-name-2",
						artistNames: ["test-artist-name-2"],
						durationInMs: 4000,
						uri: "test-uri-2",
					},
				],
				total: 1,
			};
			search.mockResolvedValue(searchExpectedResponse);
			intersectionObserverAdapter.trigger(true);

			const searchExpectedRequest: ITrackRepositoryPayload["SearchIn"] = {
				limit: 20,
				q: "keyword",
				page: 1,
			};
			await waitFor(() => {
				expect(search).toHaveBeenCalledTimes(1);
				expect(search).toHaveBeenCalledWith(searchExpectedRequest);
			});

			// Validate Show Cards
			const elements =
				await screen.findAllByTestId<HTMLAnchorElement>("search-track-item");
			expect(elements).toHaveLength(searchExpectedResponse.tracks.length);

			elements.forEach((el, index) => {
				const track = searchExpectedResponse.tracks[index];
				expect(
					within(el).getByRole("heading", { name: track.name }),
				).toBeInTheDocument();
				expect(
					within(el).getByText(`by ${track.artistNames.join(", ")}`),
				).toBeInTheDocument();
			});

			// Add Items Request
			const addItemsExpectedRequest: IPlaylistRepositoryPayload["AddItemsToPlaylistIn"] =
				{
					id: "playlist-test-id",
					uris: ["test-uri-1"],
				};
			addItems.mockResolvedValue(addItemsExpectedRequest);

			const firstElement = elements[0];
			const addButton = within(firstElement).getByRole("button");

			userEvent.click(addButton);

			await waitFor(() => {
				expect(addItems).toHaveBeenCalledTimes(1);
				expect(addItems).toHaveBeenCalledWith(addItemsExpectedRequest);
			});

			await waitFor(() => {
				expect(onSuccess).toHaveBeenCalled();
				expect(onError).not.toHaveBeenCalled();
			});
		});
	});
});
