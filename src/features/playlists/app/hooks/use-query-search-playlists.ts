import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKey } from "@/features/async-state/domain";
import { useRepositories } from "@/features/repositories/app";
import type { IPlaylistRepositoryPayload } from "../../domain";

export interface UseQuerySearchPlaylistsArgs {
	req: Pick<IPlaylistRepositoryPayload["SearchIn"], "limit" | "q">;
	enabled?: boolean;
}

export function useQuerySearchPlaylists({
	req,
	enabled,
}: UseQuerySearchPlaylistsArgs) {
	const { playlist } = useRepositories();

	return useInfiniteQuery({
		initialPageParam: 1,
		queryKey: [QueryKey.SEARCH_PLAYLISTS, req.limit, req.q],
		queryFn: (args) =>
			playlist.search({
				...req,
				page: args.pageParam,
			}),
		getNextPageParam: (lastPage) => lastPage.page + 1,
		enabled,
	});
}
