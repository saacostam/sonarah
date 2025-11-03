import { useCallback, useEffect } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { RouteName } from "@/features/router/domain";
import { ManagePlaylist, ManagePlaylistSkeleton } from "../../app";

export function ManagePlaylistScreen() {
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
						"We couldn't find a playlist with that ID.",
					),
				),
		[notificationsAdapter, routerAdapter],
	);

	useEffect(() => {
		if (id === undefined) onNotFound();
	}, [id, onNotFound]);

	return id ? (
		<ManagePlaylist
			id={id}
			onNextHref={routerAdapter.generateRoute({
				name: RouteName.MATCH_PLAYLIST_BY_ID,
				payload: { id },
			})}
			onNotFound={onNotFound}
		/>
	) : (
		<ManagePlaylistSkeleton />
	);
}
