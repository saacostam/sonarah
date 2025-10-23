import type { IPlaylist } from "@/features/playlists/domain";
import { PlaylistBrief } from "../shared";

export interface MatchPlaylistContentProps {
	playlist: IPlaylist;
}

export function MatchPlaylistContent({ playlist }: MatchPlaylistContentProps) {
	return <PlaylistBrief playlist={playlist} />;
}
