import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export interface UseQuerySearchPlaylistsArgs {
	req: Pick<IPlaylistClientPayload["SearchIn"], "limit" | "q">;
	enabled?: boolean;
}

export function useQuerySearchPlaylists({
	req,
	enabled,
}: UseQuerySearchPlaylistsArgs) {
	const { playlist } = useClients();

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
