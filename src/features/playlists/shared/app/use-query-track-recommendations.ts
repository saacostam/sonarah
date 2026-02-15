import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { ITrackClientPayload } from "../domain";

export interface UseQueryTrackRecommendationsArgs {
	req: ITrackClientPayload["GetRecommendationsIn"];
	enabled?: boolean;
}

export function useQueryTrackRecommendations({
	req,
	enabled,
}: UseQueryTrackRecommendationsArgs) {
	const { track } = useClients();

	return useQuery({
		enabled,
		queryKey: [QueryKey.TRACK_RECOMMENDATIONS, req.name],
		queryFn: () => track.getRecommendations(req),
	});
}
