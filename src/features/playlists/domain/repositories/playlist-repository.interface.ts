import type { IPlaylist } from "../entities";

export interface IPlaylistRepository {
	getAll(
		args: IPlaylistRepositoryPayload["GetAllIn"],
	): Promise<IPlaylistRepositoryPayload["GetAllOut"]>;
}

export interface IPlaylistRepositoryPayload {
	GetAllIn: {
		page: number;
		limit: number;
	};
	GetAllOut: {
		page: number;
		playlists: IPlaylist[];
		total: number;
	};
}
