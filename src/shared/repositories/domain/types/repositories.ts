import type { IAuthRepository } from "@/features/auth/domain";
import type {
	IPlaylistRepository,
	ITrackRepository,
} from "@/features/playlists/shared/domain";
import type { IUserRepository } from "@/features/user/domain";
import type { IWebPlayerRepository } from "@/features/web-player/domain";

export interface IRepositories {
	auth: IAuthRepository;
	playlist: IPlaylistRepository;
	track: ITrackRepository;
	user: IUserRepository;
	webPlayer: IWebPlayerRepository;
}
