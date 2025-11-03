import { useCallback, useEffect } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { RouteName } from "@/features/router/domain";
import {
	MatchPlaylist,
	MatchPlaylistModalManagerContext,
	MatchPlaylistModalManagerRenderer,
	MatchPlaylistSkeleton,
} from "../../app";
import { useMatchPlaylistModalManagerImpl } from "../../infra";

export function MatchPlaylistScreen() {
	const { notificationsAdapter, routerAdapter } = useAdapters();

	const { id } = routerAdapter.getParams();

	const onNotFound = useCallback(
		() =>
			routerAdapter
				.push(routerAdapter.generateRoute({ name: RouteName.DASHBOARD }))
				.finally(() =>
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Playlist Not Found",
						"We couldn't find a playlist with that ID",
					),
				),
		[notificationsAdapter, routerAdapter],
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
