import type { ILeanPlaylist, IPlaylist } from "../entities";

export interface IPlaylistRepository {
	addItems(
		args: IPlaylistRepositoryPayload["AddItemsToPlaylistIn"],
	): Promise<void>;

	create(
		args: IPlaylistRepositoryPayload["CreatePlaylistIn"],
	): Promise<IPlaylistRepositoryPayload["CreatePlaylistOut"]>;

	getAll(
		args: IPlaylistRepositoryPayload["GetAllIn"],
	): Promise<IPlaylistRepositoryPayload["GetAllOut"]>;

	getById(
		args: IPlaylistRepositoryPayload["GetByIdIn"],
	): Promise<IPlaylistRepositoryPayload["GetByIdOut"]>;

	save(
		args: IPlaylistRepositoryPayload["SaveIn"],
	): Promise<IPlaylistRepositoryPayload["SaveOut"]>;

	search(
		args: IPlaylistRepositoryPayload["SearchIn"],
	): Promise<IPlaylistRepositoryPayload["SearchOut"]>;
}

export interface IPlaylistRepositoryPayload {
	AddItemsToPlaylistIn: {
		id: string;
		uris: string[];
	};

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
		playlists: ILeanPlaylist[];
		total: number;
	};

	GetByIdIn: {
		id: string;
	};
	GetByIdOut: {
		playlist: IPlaylist;
	};

	SaveIn: {
		id: ILeanPlaylist["id"];
	};
	SaveOut: {
		id: string;
	};

	SearchIn: {
		limit: number;
		q: string;
		page: number;
	};
	SearchOut: {
		page: number;
		playlists: ILeanPlaylist[];
		total: number;
	};
}
