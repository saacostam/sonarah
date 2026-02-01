import { screen, waitFor, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type {
	IPlaylistRepositoryPayload,
	ITrackRepositoryPayload,
} from "@/features/playlists/shared/domain";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { createIntersectionObserverAdapterMock } from "@/shared/test";
import { renderWithProviders } from "@/tests";
import { SearchTrack } from "./ui";

describe("Search Track [Integration Test]", () => {
	describe("should search using word typed by user", () => {
		it("should render search items, and call add mutation if one is picked", async () => {
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

		it("should show empty-query if search results are empty", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

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
				tracks: [],
				total: 0,
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

			await waitFor(() => {
				expect(screen.getByTestId("empty-query")).toBeInTheDocument();
			});
		});

		it("should show empty-query by default", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

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
						track: {
							search,
						},
					},
				},
			);

			await waitFor(() => {
				expect(screen.getByTestId("empty-query")).toBeInTheDocument();
			});
		});

		it("focuses search field on mount", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

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
						track: {
							search,
						},
					},
				},
			);

			const input = screen.getByRole("textbox", { name: "search" });
			expect(input).toHaveFocus();
		});
	});

	describe("edge-cases", () => {
		it("should show query-error if the query fails", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

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
						track: {
							search,
						},
					},
				},
			);

			const input = screen.getByRole("textbox", { name: "search" });
			await userEvent.type(input, "keyword");

			search.mockRejectedValueOnce(
				new DomainError(DomainErrorType.APP_ERROR, "user error", "dev error"),
			);
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

			await waitFor(() => {
				expect(screen.getByTestId("query-error")).toBeInTheDocument();
			});

			// Allow refetch
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
			search.mockResolvedValueOnce(searchExpectedResponse);

			const retryButton = screen.getByRole("button", { name: "Retry" });
			await userEvent.click(retryButton);

			await waitFor(() => {
				expect(search).toHaveBeenCalledTimes(2);
				expect(search).toHaveBeenCalledWith(searchExpectedRequest);
			});
		});

		it("should handle loading queries", async () => {
			const onError = vi.fn();
			const onSuccess = vi.fn();

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
						track: {
							search,
						},
					},
				},
			);

			const input = screen.getByRole("textbox", { name: "search" });
			await userEvent.type(input, "keyword");

			let resolve!: (args: ITrackRepositoryPayload["SearchOut"]) => void;
			search.mockImplementationOnce(
				() =>
					new Promise<ITrackRepositoryPayload["SearchOut"]>((res) => {
						resolve = res;
					}),
			);
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

			await waitFor(() => {
				expect(screen.getByTestId("search-track-skeleton")).toBeInTheDocument();
			});

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
			resolve(searchExpectedResponse);

			await waitFor(() => {
				expect(screen.getByTestId("search-track-content")).toBeInTheDocument();
			});
		});

		it("should handle errors when tracks are displayed, but add mutation failed", async () => {
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
			addItems.mockRejectedValueOnce(
				new DomainError(DomainErrorType.APP_ERROR, "user error", "dev error"),
			);

			const firstElement = elements[0];
			const addButton = within(firstElement).getByRole("button");

			userEvent.click(addButton);

			await waitFor(() => {
				expect(addItems).toHaveBeenCalledTimes(1);
			});

			await waitFor(() => {
				expect(onSuccess).not.toHaveBeenCalled();
				expect(onError).toHaveBeenCalled();
			});
		});
	});
});
