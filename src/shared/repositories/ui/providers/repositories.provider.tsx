import { type PropsWithChildren, useMemo } from "react";
import type { IAuthRepository } from "@/features/auth/domain";
import { SpotifyAuthRepository } from "@/features/auth/infra/spotify-auth-repository";
import type {
	IPlaylistRepository,
	ITrackRepository,
} from "@/features/playlists/shared/domain";
import {
	PlaylistRepository,
	TrackRepository,
} from "@/features/playlists/shared/infra";
import type { IUserRepository } from "@/features/user/domain";
import { UserRepository } from "@/features/user/infra";
import type { IWebPlayerRepository } from "@/features/web-player/domain";
import { useSpotifyWebPlayerRepository } from "@/features/web-player/infra";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import { FetchClientAdapter } from "@/shared/adapters/clients/infra";
import { useAdapters } from "@/shared/adapters/core/app";
import { RepositoriesContext } from "../../app";
import type { IRepositories } from "../../domain";

const SPOTIFY_URL = "https://api.spotify.com";

export function RepositoriesProvider({ children }: PropsWithChildren) {
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

	const authRepository: IAuthRepository = useMemo(
		() => new SpotifyAuthRepository(storageAdapter, routerAdapter),
		[storageAdapter, routerAdapter],
	);
	const playlistRepository: IPlaylistRepository = useMemo(
		() => new PlaylistRepository(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const trackRepository: ITrackRepository = useMemo(
		() => new TrackRepository(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const userRepository: IUserRepository = useMemo(
		() => new UserRepository(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);
	const webPlayerRepository: IWebPlayerRepository =
		useSpotifyWebPlayerRepository({
			clientAdapter: spotifyFetchClientAdapter,
		});

	const repositories: IRepositories = useMemo(
		() => ({
			auth: authRepository,
			playlist: playlistRepository,
			track: trackRepository,
			user: userRepository,
			webPlayer: webPlayerRepository,
		}),
		[
			authRepository,
			playlistRepository,
			trackRepository,
			userRepository,
			webPlayerRepository,
		],
	);

	return (
		<RepositoriesContext.Provider value={repositories}>
			{children}
		</RepositoriesContext.Provider>
	);
}
