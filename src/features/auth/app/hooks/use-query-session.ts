import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/features/async-state/domain";
import { useAdapters } from "@/shared/adapters/core/app";

export function useQuerySession() {
	const { authAdapter } = useAdapters();

	return useQuery({
		queryKey: [QueryKey.SESSION],
		queryFn: () => authAdapter.getToken(),
	});
}
