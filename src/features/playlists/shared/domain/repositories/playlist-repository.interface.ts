import type {
	ILeanPlaylist,
	IPaginatedPlaylists,
	IPlaylist,
} from "../entities";

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

	removeItemsFromPlaylist(
		args: IPlaylistRepositoryPayload["RemoveItemsFromPlaylistIn"],
	): Promise<void>;

	reorderItemsFromPlaylist(
		args: IPlaylistRepositoryPayload["ReorderItemsFromPlaylistIn"],
	): Promise<void>;

	save(
		args: IPlaylistRepositoryPayload["SaveIn"],
	): Promise<IPlaylistRepositoryPayload["SaveOut"]>;

	search(
		args: IPlaylistRepositoryPayload["SearchIn"],
	): Promise<IPlaylistRepositoryPayload["SearchOut"]>;

	unfollow(
		args: IPlaylistRepositoryPayload["UnfollowIn"],
	): Promise<IPlaylistRepositoryPayload["UnfollowOut"]>;
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
	GetAllOut: IPaginatedPlaylists;

	GetByIdIn: {
		id: string;
	};
	GetByIdOut: {
		playlist: IPlaylist;
	};

	RemoveItemsFromPlaylistIn: {
		id: string;
		uris: string[];
	};

	ReorderItemsFromPlaylistIn: {
		playlistId: ILeanPlaylist["id"];
		rangeStart: number;
		insertBefore: number;
		rangeLength: number;
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
	SearchOut: IPaginatedPlaylists;

	UnfollowIn: {
		id: string;
	};
	UnfollowOut: {
		id: string;
	};
}
