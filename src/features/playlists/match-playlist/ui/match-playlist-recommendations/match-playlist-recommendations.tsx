import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Skeleton,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import { type Key, type Ref, useState } from "react";
import { useQueryTrackRecommendations } from "@/features/playlists/shared/app";
import type { ITrack } from "@/features/playlists/shared/domain";
import { Callout, EmptyQuery, QueryError } from "@/shared/components";
import { InformationCircleIcon } from "@/shared/icons";
import { MatchPlaylistRecommendationsContent } from "./match-playlist-recommendations-content";

export interface MatchPlaylistRecommendationsProps {
	currentMatchingTrack: ITrack;
	deltaY: number;
	key: Key;
	ref: Ref<HTMLDivElement>;
	onClickRecommendation: (track: ITrack) => void;
}

export function MatchPlaylistRecommendations({
	currentMatchingTrack,
	deltaY,
	ref,
	key,
	onClickRecommendation,
}: MatchPlaylistRecommendationsProps) {
	const queryTrackRecommendations = useQueryTrackRecommendations({
		enabled: !!currentMatchingTrack,
		req: {
			name: currentMatchingTrack?.name || "",
			artists: currentMatchingTrack?.artistNames || [],
		},
	});

	const [isInfoOpen, setIsInfoOpen] = useState(false);

	return (
		<div style={{ width: "100%", padding: 0 }} ref={ref}>
			<Card key={key} style={{ marginTop: deltaY }}>
				<Flex align="center" direction="row" gap="4" justify="between">
					<Heading>Match Track</Heading>
					<Tooltip content="How matching works">
						<Button
							onClick={() => setIsInfoOpen((v) => !v)}
							style={{ padding: "0.4rem" }}
							variant={isInfoOpen ? "solid" : "soft"}
						>
							<InformationCircleIcon height={20} width={20} />
						</Button>
					</Tooltip>
				</Flex>
				<Text>{currentMatchingTrack.name}</Text>{" "}
				<Text size="2" style={{ color: "var(--accent-9)" }}>
					by {currentMatchingTrack.artistNames.join(", ")}
				</Text>
				<Callout
					my="3"
					dismissable
					dismissed={{
						value: !isInfoOpen,
						onDismiss: () => setIsInfoOpen(false),
					}}
				>
					Matches advance automatically and can be changed anytime. You can skip
					tracks if needed.
				</Callout>
				<Box mt="2">
					{queryTrackRecommendations.isLoading ? (
						<Flex direction="column" gap="2">
							{new Array(4).fill(null).map((_, index) => (
								<Skeleton key={+index} height="74px" width="100%" />
							))}
						</Flex>
					) : queryTrackRecommendations.isSuccess ? (
						queryTrackRecommendations.data.playlists.length > 0 ? (
							<MatchPlaylistRecommendationsContent
								recommendations={queryTrackRecommendations.data}
								onClickRecommendation={onClickRecommendation}
							/>
						) : (
							<EmptyQuery />
						)
					) : (
						<QueryError
							title="Unable to fetch track recommendations"
							error={queryTrackRecommendations.error}
							retry={{
								onClick: queryTrackRecommendations.refetch,
								isPending: queryTrackRecommendations.isFetching,
							}}
						/>
					)}
				</Box>
			</Card>
		</div>
	);
}
