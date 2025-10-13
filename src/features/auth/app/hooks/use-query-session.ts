import { useQuery } from "@tanstack/react-query";
import { useAdapters } from "@/features/adapters/app";
import { QueryKey } from "@/features/async-state/domain";

export function useQuerySession() {
	const { authAdapter } = useAdapters();

	return useQuery({
		queryKey: [QueryKey.SESSION],
		queryFn: () => authAdapter.getSession(),
	});
}
