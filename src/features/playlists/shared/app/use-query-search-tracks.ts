import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { ITrackRepositoryPayload } from "../domain";

export interface UseQuerySearchTracksArgs {
	req: Pick<ITrackRepositoryPayload["SearchIn"], "limit" | "q">;
	enabled?: boolean;
}

export function useQuerySearchTracks({
	req,
	enabled,
}: UseQuerySearchTracksArgs) {
	const { track } = useRepositories();

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
