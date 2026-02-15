import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IPlaylistClientPayload } from "../domain";

export interface UseQueryMyPlaylistsArgs {
	req: IPlaylistClientPayload["GetAllIn"];
}

export function useQueryMyPlaylists({ req }: UseQueryMyPlaylistsArgs) {
	const { playlist } = useClients();

	return useQuery({
		queryKey: [QueryKey.MY_PLAYLISTS, req.page],
		queryFn: () => playlist.getAll(req),
	});
}
