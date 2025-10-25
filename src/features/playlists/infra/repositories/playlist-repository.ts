import type { IClientAdapter } from "@/features/clients/domain";
import type {
	IPlaylistRepository,
	IPlaylistRepositoryPayload,
} from "../../domain";

export class PlaylistRepository implements IPlaylistRepository {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async create(
		args: IPlaylistRepositoryPayload["CreatePlaylistIn"],
	): Promise<IPlaylistRepositoryPayload["CreatePlaylistOut"]> {
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
		args: IPlaylistRepositoryPayload["GetAllIn"],
	): Promise<IPlaylistRepositoryPayload["GetAllOut"]> {
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
				creatorName: item.owner.display_name,
				pictureUrl: item.images?.at(0)?.url,
				numberOfTracks: item.tracks.total,
			})),
		};
	}

	async getById(
		args: IPlaylistRepositoryPayload["GetByIdIn"],
	): Promise<IPlaylistRepositoryPayload["GetByIdOut"]> {
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
				display_name: string;
			};
			tracks: {
				total: number;
				items: {
					track: {
						id: string;
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
				creatorName: res.owner.display_name,
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
					})),
			},
		};
	}

	async save(
		args: IPlaylistRepositoryPayload["SaveIn"],
	): Promise<IPlaylistRepositoryPayload["SaveOut"]> {
		const { id } = args;

		await this.spotifyAuthClient.put<void>(`/v1/playlists/${id}/followers`);

		return {
			id,
		};
	}

	async search(
		args: IPlaylistRepositoryPayload["SearchIn"],
	): Promise<IPlaylistRepositoryPayload["SearchOut"]> {
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
					creatorName: item.owner.display_name,
					pictureUrl: item.images?.at(0)?.url,
					numberOfTracks: item.tracks.total,
				})),
		};
	}
}
