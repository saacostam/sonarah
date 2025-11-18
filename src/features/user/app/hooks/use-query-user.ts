import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/features/async-state/domain";
import { useRepositories } from "@/shared/repositories/app";

export function useQueryUser() {
	const { user } = useRepositories();

	return useQuery({
		queryKey: [QueryKey.USER],
		queryFn: () => user.getUser(),
	});
}
