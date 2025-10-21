import { Avatar, Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import { Link } from "react-router";
import type { ILeanPlaylist } from "@/features/playlists/domain";
import { useRouter } from "@/features/router/app";
import { RouteName } from "@/features/router/domain";

export interface PlaylistItemProps {
	playlist: ILeanPlaylist;
}

export function PlaylistItem({ playlist }: PlaylistItemProps) {
	const router = useRouter();

	return (
		<Tooltip content={`${playlist.name} by ${playlist.creatorName}`}>
			<Link
				to={router.generateRoute({
					name: RouteName.PLAYLIST_BY_ID,
					payload: { id: playlist.id },
				})}
				style={{ textDecoration: "none", color: "inherit" }}
				className="clickable"
			>
				<Flex direction="column" gap="2" width="8rem">
					<Avatar fallback={playlist.name} src={playlist.pictureUrl} size="8" />
					<div style={{ textAlign: "center" }}>
						<Heading align="center" truncate size="4">
							{playlist.name}
						</Heading>
						<Text align="center" size="2" color="red">
							{playlist.numberOfTracks} songs
						</Text>
					</div>
				</Flex>
			</Link>
		</Tooltip>
	);
}
