import { useCallback, useEffect } from "react";
import { RouteName } from "@/features/navigation/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import {
	MatchPlaylist,
	MatchPlaylistModalManagerContext,
	MatchPlaylistModalManagerRenderer,
	MatchPlaylistSkeleton,
} from "../../app";
import { useMatchPlaylistModalManagerImpl } from "../../infra";

export function MatchPlaylistScreen() {
	const { notificationsAdapter, routerAdapter, navigationAdapter } =
		useAdapters();

	const { id } = routerAdapter.getParams();

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
	);
}
