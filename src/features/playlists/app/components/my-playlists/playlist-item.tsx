import {
	Avatar,
	Card,
	DropdownMenu,
	Flex,
	Heading,
	IconButton,
	Tooltip,
} from "@radix-ui/themes";
import { Link } from "react-router";
import type { ILeanPlaylist } from "@/features/playlists/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { EllipsisVerticalIcon, TrashIcon } from "@/shared/icons";

export interface PlaylistItemProps {
	playlist: ILeanPlaylist;
	onUnfollow: () => void;
}

export function PlaylistItem({ playlist, onUnfollow }: PlaylistItemProps) {
	const { navigationAdapter } = useAdapters();

	return (
		<Tooltip content={`${playlist.name} by ${playlist.creatorName}`}>
			<Card asChild>
				<Link
					to={navigationAdapter.generateRoute({
						name: RouteName.PLAYLIST_BY_ID,
						payload: { id: playlist.id },
					})}
					style={{ textDecoration: "none", color: "inherit" }}
					data-testid="playlist-item"
				>
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
						</div>
						<Flex justify="end">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<IconButton variant="soft" aria-label="Menu Options">
										<EllipsisVerticalIcon height={24} width={24} />
									</IconButton>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item
										color="red"
										onClick={(e) => {
											e.stopPropagation();
											onUnfollow();
										}}
										aria-label="Unfollow"
									>
										Unfollow <TrashIcon height={16} width={16} />
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Flex>
					</Flex>
				</Link>
			</Card>
		</Tooltip>
	);
}
