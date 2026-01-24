import { useCallback, useState } from "react";
import { useDashboardModalManager } from "@/features/dashboard/app";
import {
	DashboardModalManagerProvider,
	DashboardModalManagerRenderer,
} from "@/features/dashboard/ui";
import { MyPlaylists } from "@/features/playlists/my-playlists/ui";

export function DashboardScreen() {
	return (
		<DashboardModalManagerProvider>
			<DashboardScreenContent />
			<DashboardModalManagerRenderer />
		</DashboardModalManagerProvider>
	);
}

export function DashboardScreenContent() {
	const paginationLimit = 14;
	const [page, setPage] = useState(1);

	const { setStatus } = useDashboardModalManager();

	const onCreatePlaylist = useCallback(
		() => setStatus({ type: "create-playlist" }),
		[setStatus],
	);

	const onImportPlaylist = useCallback(
		() => setStatus({ type: "search-playlist" }),
		[setStatus],
	);

	const onUnfollowPlaylist = useCallback(
		(id: string) => {
			setStatus({ type: "unfollow-playlist", payload: { id } });
		},
		[setStatus],
	);

	return (
		<MyPlaylists
			onCreatePlaylist={onCreatePlaylist}
			onSearchPlaylist={onImportPlaylist}
			onUnfollowPlaylist={onUnfollowPlaylist}
			page={page}
			paginationLimit={paginationLimit}
			setPage={setPage}
		/>
	);
}
