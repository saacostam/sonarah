import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";
import type { IWebPlayerRepositoryPayload } from "../domain";

export function useQueryInitWebPlayer(
	args: IWebPlayerRepositoryPayload["InitIn"],
) {
	const { webPlayer } = useRepositories();

	return useQuery({
		queryKey: [QueryKey.INIT_WEB_PLAYER],
		queryFn: () => webPlayer.init(args),
	});
}
