import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";

export function useQueryPlaybackState() {
	const { webPlayer } = useRepositories();

	return useQuery({
		queryKey: [QueryKey.PLAYBACK_STATE],
		queryFn: webPlayer.getPlaybackState.bind(webPlayer),
	});
}
