import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IPlaylistRepositoryPayload } from "../domain";

export interface UseQueryMyPlaylistsArgs {
	req: IPlaylistRepositoryPayload["GetAllIn"];
}

export function useQueryMyPlaylists({ req }: UseQueryMyPlaylistsArgs) {
	const { playlist } = useRepositories();

	return useQuery({
		queryKey: [QueryKey.MY_PLAYLISTS, req.page],
		queryFn: () => playlist.getAll(req),
	});
}
