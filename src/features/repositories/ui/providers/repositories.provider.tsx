import { type PropsWithChildren, useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { useQuerySession } from "@/features/auth/app";
import type { IClientAdapter } from "@/features/clients/domain";
import { FetchClientAdapter } from "@/features/clients/infra";
import type { IUserRepository } from "@/features/user/domain";
import { UserRepository } from "@/features/user/infra";
import { RepositoriesContext } from "../../app";
import type { IRepositories } from "../../domain";

const SPOTIFY_URL = "https://api.spotify.com";

export function RepositoriesProvider({ children }: PropsWithChildren) {
	const { authAdapter, routerAdapter } = useAdapters();

	const session = useQuerySession();

	const spotifyFetchClientAdapter: IClientAdapter = useMemo(
		() =>
			new FetchClientAdapter(authAdapter, routerAdapter, {
				baseUrl: SPOTIFY_URL,
				defaultHeaders: {
					Authorization: `Bearer ${session.data?.type === "authenticated" ? session.data.token : ""}`,
				},
			}),
		[authAdapter, routerAdapter, session.data],
	);

	const userRepository: IUserRepository = useMemo(
		() => new UserRepository(spotifyFetchClientAdapter),
		[spotifyFetchClientAdapter],
	);

	const repositories: IRepositories = useMemo(
		() => ({
			user: userRepository,
		}),
		[userRepository],
	);

	return (
		<RepositoriesContext.Provider value={repositories}>
			{children}
		</RepositoriesContext.Provider>
	);
}
