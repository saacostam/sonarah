import type {
	ILeanPlaylist,
	IPaginatedPlaylists,
	IPlaylist,
} from "../entities";

export interface IPlaylistClient {
	addItems(args: IPlaylistClientPayload["AddItemsToPlaylistIn"]): Promise<void>;

	create(
		args: IPlaylistClientPayload["CreatePlaylistIn"],
	): Promise<IPlaylistClientPayload["CreatePlaylistOut"]>;

	getAll(
		args: IPlaylistClientPayload["GetAllIn"],
	): Promise<IPlaylistClientPayload["GetAllOut"]>;

	getById(
		args: IPlaylistClientPayload["GetByIdIn"],
	): Promise<IPlaylistClientPayload["GetByIdOut"]>;

	removeItemsFromPlaylist(
		args: IPlaylistClientPayload["RemoveItemsFromPlaylistIn"],
	): Promise<void>;

	reorderItemsFromPlaylist(
		args: IPlaylistClientPayload["ReorderItemsFromPlaylistIn"],
	): Promise<void>;

	save(
		args: IPlaylistClientPayload["SaveIn"],
	): Promise<IPlaylistClientPayload["SaveOut"]>;

	search(
		args: IPlaylistClientPayload["SearchIn"],
	): Promise<IPlaylistClientPayload["SearchOut"]>;

	unfollow(
		args: IPlaylistClientPayload["UnfollowIn"],
	): Promise<IPlaylistClientPayload["UnfollowOut"]>;
}

export interface IPlaylistClientPayload {
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
