import { QueryKey, useMetaQuery } from "@/shared/async-state";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export interface UseQueryPlaylistByIdArgs {
	req: IPlaylistRepositoryPayload["GetByIdIn"];
	enabled?: boolean;
}

export function useQueryPlaylistById({
	req,
	enabled,
}: UseQueryPlaylistByIdArgs) {
	const { playlist } = useRepositories();

	return useMetaQuery({
		queryKey: [QueryKey.PLAYLIST_BY_ID, req.id],
		queryFn: () => playlist.getById(req),
		enabled,
	});
}
