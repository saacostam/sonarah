import type {
	IPlaylistRepository,
	ITrackRepository,
} from "@/features/playlists/domain";
import type { IUserRepository } from "@/features/user/domain";

export interface IRepositories {
	playlist: IPlaylistRepository;
	track: ITrackRepository;
	user: IUserRepository;
}
