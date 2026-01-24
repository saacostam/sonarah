import {
	Avatar,
	Card,
	ContextMenu,
	Flex,
	Heading,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import { Link } from "react-router";
import type { ILeanPlaylist } from "@/features/playlists/shared/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { TrashIcon } from "@/shared/icons";

export interface PlaylistItemProps {
	playlist: ILeanPlaylist;
	onUnfollow: () => void;
}

export function PlaylistItem({ playlist, onUnfollow }: PlaylistItemProps) {
	const { navigationAdapter } = useAdapters();

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<Card asChild>
					<Link
						to={navigationAdapter.generateRoute({
							name: RouteName.PLAYLIST_BY_ID,
							payload: { id: playlist.id },
						})}
						style={{ textDecoration: "none", color: "inherit" }}
						data-testid="playlist-item"
					>
						<Tooltip content={`${playlist.name} by ${playlist.creator.name}`}>
							<Flex
								direction="column"
								gap="2"
								style={{ position: "relative" }}
								width="8rem"
							>
								<Avatar
									fallback={playlist.name}
									src={playlist.pictureUrl}
									size="8"
								/>
								<div style={{ textAlign: "center" }}>
									<Heading align="center" truncate size="4">
										{playlist.name}
									</Heading>
									<Text
										align="center"
										size="2"
										style={{ color: "var(--accent-9)" }}
									>
										{playlist.numberOfTracks} songs
									</Text>
								</div>
							</Flex>
						</Tooltip>
					</Link>
				</Card>
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item
					color="red"
					onClick={(e) => {
						e.stopPropagation();
						onUnfollow();
					}}
					aria-label="Unfollow"
				>
					Unfollow <TrashIcon height={16} width={16} />
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}
