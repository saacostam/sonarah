import { type PropsWithChildren, useMemo } from "react";
import type {
	IPlaylistRepository,
	ITrackRepository,
} from "@/features/playlists/domain";
import {
	PlaylistRepository,
	TrackRepository,
} from "@/features/playlists/infra";
import type { IUserRepository } from "@/features/user/domain";
import { UserRepository } from "@/features/user/infra";
import type { IWebPlayerRepository } from "@/features/web-player/domain";
import { useSpotifyWebPlayerRepository } from "@/features/web-player/infra";
import { useQuerySession } from "@/shared/adapters/auth/app";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import { FetchClientAdapter } from "@/shared/adapters/clients/infra";
import { useAdapters } from "@/shared/adapters/core/app";
import { RepositoriesContext } from "../../app";
import type { IRepositories } from "../../domain";

const SPOTIFY_URL = "https://api.spotify.com";

export function RepositoriesProvider({ children }: PropsWithChildren) {
	const {
		authAdapter,
		routerAdapter,
		navigationAdapter,
		notificationsAdapter,
		storageAdapter,
	} = useAdapters();

	const session = useQuerySession();

	const spotifyFetchClientAdapter: IClientAdapter = useMemo(
		() =>
			new FetchClientAdapter(authAdapter, routerAdapter, navigationAdapter, {
				baseUrl: SPOTIFY_URL,
				defaultHeaders: {
					Authorization: `Bearer ${session.data?.type === "authenticated" ? session.data.token : ""}`,
				},
			}),
		[authAdapter, routerAdapter, navigationAdapter, session.data],
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
			notificationsAdapter,
			storageAdapter,
			clientAdapter: spotifyFetchClientAdapter,
		});

	const repositories: IRepositories = useMemo(
		() => ({
			playlist: playlistRepository,
			track: trackRepository,
			user: userRepository,
			webPlayer: webPlayerRepository,
		}),
		[playlistRepository, trackRepository, userRepository, webPlayerRepository],
	);

	return (
		<RepositoriesContext.Provider value={repositories}>
			{children}
		</RepositoriesContext.Provider>
	);
}
