import { useCallback } from "react";
import { MyPlaylists } from "@/features/playlists/app";
import { DashboardModalManager } from "../components";
import {
	DashboardModalManagerProvider,
	useDashboardModalManager,
} from "../contexts";

export function DashboardScreen() {
	return (
		<DashboardModalManagerProvider>
			<DashboardScreenContent />
			<DashboardModalManager />
		</DashboardModalManagerProvider>
	);
}

function DashboardScreenContent() {
	const { setStatus } = useDashboardModalManager();

	const onCreatePlaylist = useCallback(
		() => setStatus({ type: "create-playlist" }),
		[setStatus],
	);

	const onImportPlaylist = useCallback(
		() => setStatus({ type: "search-playlist" }),
		[setStatus],
	);

	return (
		<MyPlaylists
			onCreatePlaylist={onCreatePlaylist}
			onSearchPlaylist={onImportPlaylist}
		/>
	);
}
