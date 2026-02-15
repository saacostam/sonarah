import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";
import type { IWebPlayerClientPayload } from "../../domain";

export function useMutationPlayTrackOfPlaylist() {
	const { webPlayer } = useClients();

	return useMutation({
		mutationKey: [MutationKey.PLAY_TRACK_OF_PLAYLIST],
		mutationFn: (args: IWebPlayerClientPayload["PlayTrackOfPlaylistIn"]) =>
			webPlayer.playTrackOfPlaylist(args),
	});
}
