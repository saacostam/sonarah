import { type PropsWithChildren, useMemo } from "react";
import { useQuerySession } from "@/features/auth/app";
import type { IClientAdapter } from "@/features/clients/domain";
import { FetchClientAdapter } from "@/features/clients/infra";
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
import { useAdapters } from "@/shared/adapters/app";
import { RepositoriesContext } from "../../app";
import type { IRepositories } from "../../domain";

const SPOTIFY_URL = "https://api.spotify.com";

export function RepositoriesProvider({ children }: PropsWithChildren) {
	const { authAdapter, routerAdapter, navigationAdapter } = useAdapters();

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

	const repositories: IRepositories = useMemo(
		() => ({
			playlist: playlistRepository,
			track: trackRepository,
			user: userRepository,
		}),
		[playlistRepository, trackRepository, userRepository],
	);

	return (
		<RepositoriesContext.Provider value={repositories}>
			{children}
		</RepositoriesContext.Provider>
	);
}
