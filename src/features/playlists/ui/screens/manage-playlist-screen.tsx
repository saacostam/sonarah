import { useCallback, useEffect } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { RouteName } from "@/features/routes/domain";
import { ManagePlaylist, ManagePlaylistSkeleton } from "../../app";

export function ManagePlaylistScreen() {
	const { notificationsAdapter, routerAdapter, routesAdapter } = useAdapters();

	const { id } = routerAdapter.getParams();

	const onNotFound = useCallback(
		() =>
			routerAdapter
				.push(routesAdapter.generateRoute({ name: RouteName.DASHBOARD }))
				.finally(() =>
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Playlist Not Found",
						"We couldn't find a playlist with that ID.",
					),
				),
		[notificationsAdapter, routerAdapter, routesAdapter],
	);

	useEffect(() => {
		if (id === undefined) onNotFound();
	}, [id, onNotFound]);

	return id ? (
		<ManagePlaylist
			id={id}
			onNextHref={routesAdapter.generateRoute({
				name: RouteName.MATCH_PLAYLIST_BY_ID,
				payload: { id },
			})}
			onNotFound={onNotFound}
		/>
	) : (
		<ManagePlaylistSkeleton />
	);
}
