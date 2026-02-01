import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useRepositories } from "@/shared/repositories/app";
import type { ITrackRepositoryPayload } from "../domain";

export interface UseQueryTrackRecommendationsArgs {
	req: ITrackRepositoryPayload["GetRecommendationsIn"];
	enabled?: boolean;
}

export function useQueryTrackRecommendations({
	req,
	enabled,
}: UseQueryTrackRecommendationsArgs) {
	const { track } = useRepositories();

	return useQuery({
		enabled,
		queryKey: [QueryKey.TRACK_RECOMMENDATIONS, req.name],
		queryFn: () => track.getRecommendations(req),
	});
}
