import {
	Avatar,
	Button,
	Card,
	Flex,
	Heading,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import type { ITrack } from "@/features/playlists/shared/domain";
import { PlusIcon } from "@/shared/icons";

export interface SearchTrackItemProps {
	isPending: boolean;
	onAdd: (uri: string) => void;
	order: number;
	track: ITrack;
}

export function SearchTrackItem({
	isPending,
	onAdd,
	order,
	track,
}: SearchTrackItemProps) {
	return (
		<Card>
			<Flex
				direction="row"
				gap="4"
				justify="between"
				align="center"
				maxWidth="100%"
			>
				<Avatar fallback={order} src={track.pictureUrl} size="4" />
				<div style={{ flexGrow: 1, minWidth: 0 }}>
					<Heading size="3" truncate>
						{track.name}
					</Heading>
					<Text
						size="2"
						truncate
						style={{ color: "var(--gray-11)", display: "block" }}
					>
						by {track.artistNames.join(", ")}
					</Text>
				</div>
				<Tooltip content="Expand songs">
					<Button
						radius="full"
						onClick={() => onAdd(track.uri)}
						variant="ghost"
						loading={isPending}
					>
						<PlusIcon height={18} width={18} />
					</Button>
				</Tooltip>
			</Flex>
		</Card>
	);
}
