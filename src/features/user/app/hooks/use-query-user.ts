import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/shared/async-state";
import { useClients } from "@/shared/clients/app";

export function useQueryUser() {
	const { user } = useClients();

	return useQuery({
		queryKey: [QueryKey.USER],
		queryFn: () => user.getUser(),
	});
}
