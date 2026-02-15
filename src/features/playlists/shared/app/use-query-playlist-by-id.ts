import { QueryKey, useMetaQuery } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export interface UseQueryPlaylistByIdArgs {
	req: IPlaylistClientPayload["GetByIdIn"];
	enabled?: boolean;
}

export function useQueryPlaylistById({
	req,
	enabled,
}: UseQueryPlaylistByIdArgs) {
	const { playlist } = useClients();

	return useMetaQuery({
		queryKey: [QueryKey.PLAYLIST_BY_ID, req.id],
		queryFn: () => playlist.getById(req),
		enabled,
	});
}
