import { useCallback, useEffect } from "react";
import { MatchPlaylistModalManagerContext } from "@/features/playlists/match-playlist/app";
import { useMatchPlaylistModalManagerImpl } from "@/features/playlists/match-playlist/infra";
import {
	MatchPlaylist,
	MatchPlaylistModalManagerRenderer,
	MatchPlaylistSkeleton,
} from "@/features/playlists/match-playlist/ui";
import { WebPlayerManagerProvider } from "@/features/web-player/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";

export function MatchPlaylistScreen() {
	const { notificationsAdapter, routerAdapter, navigationAdapter } =
		useAdapters();

	const { id } = routerAdapter.useParams();

	const onNotFound = useCallback(
		() =>
			routerAdapter
				.push(navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }))
				.finally(() =>
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Playlist Not Found",
						"We couldn't find a playlist with that ID",
					),
				),
		[notificationsAdapter, routerAdapter, navigationAdapter],
	);

	useEffect(() => {
		if (id === undefined) onNotFound();
	}, [id, onNotFound]);

	return (
		<WebPlayerManagerProvider>
			<MatchPlaylistModalManagerContext.Provider
				value={useMatchPlaylistModalManagerImpl()}
			>
				{id ? (
					<MatchPlaylist id={id} onNotFound={onNotFound} />
				) : (
					<MatchPlaylistSkeleton />
				)}
				<MatchPlaylistModalManagerRenderer />
			</MatchPlaylistModalManagerContext.Provider>
		</WebPlayerManagerProvider>
	);
}
