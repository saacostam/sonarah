import { useMutation } from "@tanstack/react-query";
import { MutationKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients//app";
import type { IWebPlayerClientPayload } from "../../domain";

export function useMutationSeekToPosition() {
	const { webPlayer } = useClients();

	return useMutation({
		mutationKey: [MutationKey.SEEK_TO_POSITION],
		mutationFn: (args: IWebPlayerClientPayload["SeekToPositionIn"]) =>
			webPlayer.seekToPosition(args),
	});
}
