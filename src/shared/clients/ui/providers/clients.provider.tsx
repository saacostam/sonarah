import { type PropsWithChildren, useMemo } from "react";
import type { IAuthClient } from "@/features/auth/domain";
import { SpotifyAuthClient } from "@/features/auth/infra/spotify-auth-client";
import type {
	IPlaylistClient,
	ITrackClient,
} from "@/features/playlists/shared/domain";
import { PlaylistClient, TrackClient } from "@/features/playlists/shared/infra";
import type { IUserClient } from "@/features/user/domain";
import { UserClient } from "@/features/user/infra";
import type { IWebPlayerClient } from "@/features/web-player/domain";
import { useSpotifyWebPlayerClient } from "@/features/web-player/infra";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import { FetchClientAdapter } from "@/shared/adapters/clients/infra";
import { useAdapters } from "@/shared/adapters/core/app";
import { ClientsContext } from "../../app";
import type { IClients } from "../../domain";

const SPOTIFY_URL = "https://api.spotify.com";

export function ClientsProvider({ children }: PropsWithChildren) {
	const { authAdapter, navigationAdapter, storageAdapter, routerAdapter } =
		useAdapters();

	const session = authAdapter.getToken();

	const spotifyFetchClientAdapter: IClientAdapter = useMemo(
		() =>
			new FetchClientAdapter(authAdapter, routerAdapter, navigationAdapter, {
				baseUrl: SPOTIFY_URL,
				defaultHeaders: {
					Authorization: `Bearer ${session.type === "authenticated" ? session.token : ""}`,
				},
			}),
		[authAdapter, routerAdapter, navigationAdapter, session],
	);

	const authClient: IAuthClient = useMemo(
		() => new SpotifyAuthClient(storageAdapter, routerAdapter),
		[storageAdapter, routerAdapter],
	);
	const playlistClient: IPlaylistClient = useMemo(
		() => new PlaylistClient(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const trackClient: ITrackClient = useMemo(
		() => new TrackClient(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const userClient: IUserClient = useMemo(
		() => new UserClient(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const webPlayerClient: IWebPlayerClient = useSpotifyWebPlayerClient({
		clientAdapter: spotifyFetchClientAdapter,
	});

	const clients: IClients = useMemo(
		() => ({
			auth: authClient,
			playlist: playlistClient,
			track: trackClient,
			user: userClient,
			webPlayer: webPlayerClient,
		}),
		[authClient, playlistClient, trackClient, userClient, webPlayerClient],
	);

	return (
		<ClientsContext.Provider value={clients}>
			{children}
		</ClientsContext.Provider>
	);
}
