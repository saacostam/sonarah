import type { IPlaylistRepository } from "@/features/playlists/domain";
import type { IUserRepository } from "@/features/user/domain";

export interface IRepositories {
	playlist: IPlaylistRepository;
	user: IUserRepository;
}
