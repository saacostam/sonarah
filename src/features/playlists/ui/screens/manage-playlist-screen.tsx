import { useCallback, useEffect } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { ManagePlaylist, ManagePlaylistSkeleton } from "../../app";

export function ManagePlaylistScreen() {
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
