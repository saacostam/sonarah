import { Avatar, Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import { Link } from "react-router";
import { useAdapters } from "@/features/adapters/app";
import type { ILeanPlaylist } from "@/features/playlists/domain";
import { RouteName } from "@/features/routes/domain";

export interface PlaylistItemProps {
	playlist: ILeanPlaylist;
}

export function PlaylistItem({ playlist }: PlaylistItemProps) {
	const { routesAdapter } = useAdapters();

	return (
		<Tooltip content={`${playlist.name} by ${playlist.creatorName}`}>
			<Link
				to={routesAdapter.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: playlist.id },
				})}
				style={{ textDecoration: "none", color: "inherit" }}
				className="clickable"
				data-testid="playlist-item"
			>
				<Flex direction="column" gap="2" width="8rem">
					<Avatar fallback={playlist.name} src={playlist.pictureUrl} size="8" />
					<div style={{ textAlign: "center" }}>
						<Heading align="center" truncate size="4">
							{playlist.name}
						</Heading>
						<Text align="center" size="2" style={{ color: "var(--accent-9)" }}>
							{playlist.numberOfTracks} songs
						</Text>
					</div>
				</Flex>
			</Link>
		</Tooltip>
	);
}
