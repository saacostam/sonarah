import { useCallback, useState } from "react";
import { MyPlaylists } from "@/features/playlists/my-playlists/ui";
import { useDashboardModalManager } from "../../app";
import { DashboardModalManagerRenderer } from "../components";
import { DashboardModalManagerProvider } from "../providers";

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
