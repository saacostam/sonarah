import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import type { IPlaylistClient, IPlaylistClientPayload } from "../../domain";

export class PlaylistClient implements IPlaylistClient {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async addItems(
		args: IPlaylistClientPayload["AddItemsToPlaylistIn"],
	): Promise<void> {
		const { id, uris } = args;

		await this.spotifyAuthClient.post<void>(`/v1/playlists/${id}/tracks`, {
			uris,
		});
	}

	async create(
		args: IPlaylistClientPayload["CreatePlaylistIn"],
	): Promise<IPlaylistClientPayload["CreatePlaylistOut"]> {
		const { name, userId, visibility } = args;

		const res = await this.spotifyAuthClient.post<{
			id: string;
		}>(`/v1/users/${userId}/playlists`, {
			name,
			public: visibility === "public",
		});

		return {
			id: res.id,
		};
	}

	async getAll(
		args: IPlaylistClientPayload["GetAllIn"],
	): Promise<IPlaylistClientPayload["GetAllOut"]> {
		const { page, limit } = args;

		const urlParams = new URLSearchParams();
		urlParams.append("limit", String(limit));
		urlParams.append("offset", String(limit * (page - 1)));

		const res = await this.spotifyAuthClient.get<{
			total: number;
			items: {
				id: string;
				images:
					| null
					| {
							url: string;
					  }[];
				name: string;
				owner: {
					id: string;
					display_name: string;
				};
				tracks: {
					total: number;
				};
			}[];
		}>(`/v1/me/playlists?${urlParams.toString()}`);

		return {
			page: page,
			total: res.total,
			playlists: res.items.map((item) => ({
				id: item.id,
				name: item.name,
				creator: {
					id: item.owner.id,
					name: item.owner.display_name,
				},
				pictureUrl: item.images?.at(0)?.url,
				numberOfTracks: item.tracks.total,
			})),
			limit,
		};
	}

	async getById(
		args: IPlaylistClientPayload["GetByIdIn"],
	): Promise<IPlaylistClientPayload["GetByIdOut"]> {
		const { id } = args;

		const res = await this.spotifyAuthClient.get<{
			id: string;
			images:
				| null
				| {
						url: string;
				  }[];
			name: string;
			owner: {
				id: string;
				display_name: string;
			};
			tracks: {
				total: number;
				items: {
					track: {
						id: string;
						uri: string;
						name: string;
						artists: {
							id: string;
							name: string;
						}[];
						duration_ms: number;
						album: {
							images:
								| null
								| {
										url: string;
								  }[];
						};
					};
				}[];
			};
		}>(`/v1/playlists/${id}`);

		return {
			playlist: {
				id: res.id,
				name: res.name,
				creator: {
					id: res.owner.id,
					name: res.owner.display_name,
				},
				numberOfTracks: res.tracks.total,
				pictureUrl: res.images?.at(0)?.url,
				tracks: res.tracks.items
					.filter((item) => item.track)
					.map((item) => ({
						id: item.track.id,
						name: item.track.name,
						artistNames: item.track.artists.map((artist) => artist.name),
						durationInMs: item.track.duration_ms,
						pictureUrl: item.track.album.images?.at(0)?.url,
						uri: item.track.uri,
					})),
			},
		};
	}

	async removeItemsFromPlaylist(
		args: IPlaylistClientPayload["RemoveItemsFromPlaylistIn"],
	): Promise<void> {
		const { id, uris } = args;

		await this.spotifyAuthClient.delete<void>(`/v1/playlists/${id}/tracks`, {
			tracks: uris.map((uri) => ({
				uri,
			})),
		});
	}

	async reorderItemsFromPlaylist(
		args: IPlaylistClientPayload["ReorderItemsFromPlaylistIn"],
	): Promise<void> {
		const { playlistId, rangeStart, insertBefore, rangeLength } = args;

		await this.spotifyAuthClient.put<void>(
			`/v1/playlists/${playlistId}/tracks`,
			{
				range_start: rangeStart,
				insert_before: insertBefore,
				range_length: rangeLength,
			},
		);
	}

	async save(
		args: IPlaylistClientPayload["SaveIn"],
	): Promise<IPlaylistClientPayload["SaveOut"]> {
		const { id } = args;

		await this.spotifyAuthClient.put<void>(`/v1/playlists/${id}/followers`);

		return {
			id,
		};
	}

	async search(
		args: IPlaylistClientPayload["SearchIn"],
	): Promise<IPlaylistClientPayload["SearchOut"]> {
		const { q, limit, page } = args;

		const urlParams = new URLSearchParams();
		urlParams.append("q", q);
		urlParams.append("type", "playlist");
		urlParams.append("limit", String(limit));
		urlParams.append("offset", String(limit * (page - 1)));

		const res = await this.spotifyAuthClient.get<{
			playlists: {
				total: number;
				items: (null | {
					id: string;
					name: string;
					images:
						| null
						| {
								url: string;
						  }[];
					owner: {
						id: string;
						display_name: string;
					};
					tracks: {
						total: number;
					};
				})[];
			};
		}>(`/v1/search?${urlParams.toString()}`);

		return {
			page,
			total: res.playlists.total,
			playlists: res.playlists.items
				.filter((item) => item !== null)
				.map((item) => ({
					id: item.id,
					name: item.name,
					creator: {
						id: item.owner.id,
						name: item.owner.display_name,
					},
					pictureUrl: item.images?.at(0)?.url,
					numberOfTracks: item.tracks.total,
				})),
			limit,
		};
	}

	async unfollow(
		args: IPlaylistClientPayload["UnfollowIn"],
	): Promise<IPlaylistClientPayload["UnfollowOut"]> {
		const { id } = args;

		await this.spotifyAuthClient.delete(`/v1/playlists/${id}/followers`);

		return {
			id,
		};
	}
}
