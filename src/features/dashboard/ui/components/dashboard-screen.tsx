import { useQueryUser } from "@/features/user/app";

export function DashboardScreen() {
	const user = useQueryUser();

	if (user.isSuccess) return JSON.stringify(user.data);
}
