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
				tracks: res.tracks.items.map((item) => ({
					id: item.track.id,
					name: item.track.name,
					artistNames: item.track.artists.map((artist) => artist.name),
				})),
			},
		};
	}
}
