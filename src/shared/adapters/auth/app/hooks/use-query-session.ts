import { useQuery } from "@tanstack/react-query";
import { useAdapters } from "@/shared/adapters/core/app";
import { QueryKey } from "@/shared/async-state/domain";

export function useQuerySession() {
	const { authAdapter } = useAdapters();

	return useQuery({
		queryKey: [QueryKey.SESSION],
		queryFn: () => authAdapter.getToken(),
	});
}
