import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { ITrackClientPayload } from "../domain";

export interface UseQuerySearchTracksArgs {
	req: Pick<ITrackClientPayload["SearchIn"], "limit" | "q">;
	enabled?: boolean;
}

export function useQuerySearchTracks({
	req,
	enabled,
}: UseQuerySearchTracksArgs) {
	const { track } = useClients();

	return useInfiniteQuery({
		initialPageParam: 1,
		queryKey: [QueryKey.SEARCH_PLAYLISTS, req.limit, req.q],
		queryFn: (args) =>
			track.search({
				...req,
				page: args.pageParam,
			}),
		getNextPageParam: (lastPage) => lastPage.page + 1,
		enabled,
	});
}
