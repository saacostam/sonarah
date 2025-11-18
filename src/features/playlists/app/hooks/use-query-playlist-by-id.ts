import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/features/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../../domain";

export interface UseQueryPlaylistByIdArgs {
	req: IPlaylistRepositoryPayload["GetByIdIn"];
	enabled?: boolean;
}

export function useQueryPlaylistById({
	req,
	enabled,
}: UseQueryPlaylistByIdArgs) {
	const { playlist } = useRepositories();

	return useQuery({
		queryKey: [QueryKey.PLAYLIST_BY_ID, req.id],
		queryFn: () => playlist.getById(req),
		enabled,
	});
}
