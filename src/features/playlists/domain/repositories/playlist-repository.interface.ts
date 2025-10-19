import type { IPlaylist } from "../entities";

export interface IPlaylistRepository {
	create(
		args: IPlaylistRepositoryPayload["CreatePlaylistIn"],
	): Promise<IPlaylistRepositoryPayload["CreatePlaylistOut"]>;

	getAll(
		args: IPlaylistRepositoryPayload["GetAllIn"],
	): Promise<IPlaylistRepositoryPayload["GetAllOut"]>;
}

export interface IPlaylistRepositoryPayload {
	CreatePlaylistIn: {
		userId: string;
		name: string;
		visibility: "public" | "private";
	};
	CreatePlaylistOut: {
		id: string;
	};

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
