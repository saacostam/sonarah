import { useCallback } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";
import {
	ManagePlaylist,
	ManagePlaylistSkeleton,
} from "../components/manage-playlist";

export function ManagePlaylistScreen() {
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
						"We couldn’t find a playlist with that ID.",
					),
				),
		[notificationsAdapter, router],
	);

	return id ? (
		<ManagePlaylist id={id} onNotFound={onNotFound} />
	) : (
		<ManagePlaylistSkeleton />
	);
}
