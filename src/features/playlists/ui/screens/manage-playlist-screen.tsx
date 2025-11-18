import { useCallback, useEffect } from "react";
import { RouteName } from "@/features/navigation/domain";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { useAdapters } from "@/shared/adapters/app";
import { ManagePlaylist, ManagePlaylistSkeleton } from "../../app";

export function ManagePlaylistScreen() {
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
						"We couldn't find a playlist with that ID.",
					),
				),
		[notificationsAdapter, routerAdapter, navigationAdapter],
	);

	useEffect(() => {
		if (id === undefined) onNotFound();
	}, [id, onNotFound]);

	return id ? (
		<ManagePlaylist
			id={id}
			onNextHref={navigationAdapter.generateRoute({
				name: RouteName.MATCH_PLAYLIST_BY_ID,
				payload: { id },
			})}
			onNotFound={onNotFound}
		/>
	) : (
		<ManagePlaylistSkeleton />
	);
}
