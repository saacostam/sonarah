import {
	Avatar,
	Button,
	Card,
	Flex,
	Heading,
	Skeleton,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQueryPlaylistById } from "@/features/playlists/shared/app";
import type { ILeanPlaylist } from "@/features/playlists/shared/domain";
import { QueryError } from "@/shared/components";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	PlusIcon,
} from "@/shared/icons";

export interface PlaylistItemProps {
	isExpanded: boolean;
	isPending: boolean;
	onAdd: (id: string) => void;
	onCollapse: (id: string | undefined) => void;
	order: number;
	playlist: ILeanPlaylist;
}

export function PlaylistSearchItem({
	isExpanded,
	isPending,
	onAdd,
	onCollapse,
	order,
	playlist,
}: PlaylistItemProps) {
	const playlistById = useQueryPlaylistById({
		req: {
			id: playlist.id,
		},
		enabled: isExpanded,
	});

	const [page, setPage] = useState(1);

	return (
		<Card>
			<Flex
				direction="row"
				gap="4"
				justify="between"
				align="center"
				maxWidth="100%"
			>
				<Avatar fallback={order} src={playlist.pictureUrl} size="4" />
				<div style={{ flexGrow: 1, minWidth: 0 }}>
					<Heading size="3" truncate>
						{playlist.name}
					</Heading>
					<Text
						size="2"
						truncate
						style={{ color: "var(--gray-11)", display: "block" }}
					>
						by {playlist.creator.name}
					</Text>
				</div>
				<Flex gap="2" flexShrink="0">
					<Tooltip content="Expand songs">
						<Button
							radius="full"
							onClick={() => onCollapse(isExpanded ? undefined : playlist.id)}
							variant="ghost"
						>
							{isExpanded ? (
								<ChevronUpIcon height={18} width={18} />
							) : (
								<ChevronDownIcon height={18} width={18} />
							)}
						</Button>
					</Tooltip>
					<Tooltip content="Add playlist">
						<Button
							radius="full"
							onClick={() => onAdd(playlist.id)}
							variant="ghost"
							loading={isPending}
						>
							<PlusIcon height={18} width={18} />
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						key="tracks"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						style={{ marginTop: "1rem" }}
					>
						<Card>
							{playlistById.isLoading ? (
								<Flex direction="column" gap="1">
									<Flex align="center" direction="row" justify="between" mb="4">
										<Skeleton height="24px" width="24px" />
										<Skeleton height="20px" width="48px" />
										<Skeleton height="24px" width="24px" />
									</Flex>
									<Skeleton height="20px" width="100%" />
									<Skeleton height="20px" width="100%" />
									<Skeleton height="20px" width="100%" />
									<Skeleton height="20px" width="100%" />
								</Flex>
							) : playlistById.isSuccess ? (
								<Flex direction="column" gap="1">
									<Flex align="center" direction="row" justify="between" mb="3">
										<Tooltip content="Prev">
											<Button
												disabled={page <= 1}
												onClick={() => setPage((p) => p - 1)}
												radius="full"
												size="1"
											>
												<ChevronLeftIcon height={16} width={16} />
											</Button>
										</Tooltip>
										<Heading size="3">Tracks</Heading>
										<Tooltip content="Next">
											<Button
												disabled={
													page >=
													Math.ceil(
														playlistById.data.playlist.tracks.length / 5,
													)
												}
												onClick={() => setPage((p) => p + 1)}
												radius="full"
												size="1"
											>
												<ChevronRightIcon height={16} width={16} />
											</Button>
										</Tooltip>
									</Flex>
									{playlistById.data.playlist.tracks
										.slice((page - 1) * 5, page * 5)
										.map((track) => (
											<Tooltip
												key={track.id}
												content={`${track.name} by ${track.artistNames.join(", ")}`}
											>
												<Text size="2" truncate>
													{track.name}{" "}
													<Text size="1" style={{ color: "var(--accent-9)" }}>
														by {track.artistNames.join(", ")}
													</Text>
												</Text>
											</Tooltip>
										))}
								</Flex>
							) : (
								<QueryError
									title="Unable to fetch playlist"
									error={playlistById.error}
									retry={{
										onClick: playlistById.refetch,
										isPending: playlistById.isFetching,
									}}
								/>
							)}
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</Card>
	);
}
