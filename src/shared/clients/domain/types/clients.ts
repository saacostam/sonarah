import type { IAuthClient } from "@/features/auth/domain";
import type {
	IPlaylistClient,
	ITrackClient,
} from "@/features/playlists/shared/domain";
import type { IUserClient } from "@/features/user/domain";
import type { IWebPlayerClient } from "@/features/web-player/domain";

export interface IClients {
	auth: IAuthClient;
	playlist: IPlaylistClient;
	track: ITrackClient;
	user: IUserClient;
	webPlayer: IWebPlayerClient;
}
