import type {
	IPlaylistRepository,
	ITrackRepository,
} from "@/features/playlists/domain";
import type { IUserRepository } from "@/features/user/domain";
import type { IWebPlayerRepository } from "@/features/web-player/domain";

export interface IRepositories {
	playlist: IPlaylistRepository;
	track: ITrackRepository;
	user: IUserRepository;
	webPlayer: IWebPlayerRepository;
}
