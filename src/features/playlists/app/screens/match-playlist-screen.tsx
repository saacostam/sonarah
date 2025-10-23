import { useCallback, useEffect } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";
import { MatchPlaylist } from "../components/match-playlist";

export function MatchPlaylistScreen() {
	const { notificationsAdapter } = useAdapters();
	const router = useRouter();

	const { id } = router.getParams();

	const onNotFound = useCallback(
		() =>
			router
				.push(router.generateRoute({ name: RouteName.DASHBOARD }))
				.finally(() =>
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Playlist Not Found",
						"We couldn't find a playlist with that ID",
					),
				),
		[notificationsAdapter, router],
	);

	useEffect(() => {
		if (id === undefined) onNotFound();
	}, [id, onNotFound]);

	return id ? <MatchPlaylist /> : <MatchPlaylist />;
}
