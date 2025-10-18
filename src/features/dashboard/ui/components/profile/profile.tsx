import { useQueryUser } from "@/features/user/app";
import { QueryError } from "@/shared/components";
import { ProfileContent } from "./profile-content";
import { ProfileSkeleton } from "./profile-skeleton";

export function Profile() {
	const user = useQueryUser();

	if (user.isError)
		return (
			<QueryError
				title="Unable to fetch user profile"
				retry={{ onClick: user.refetch, isPending: user.isPending }}
			/>
		);
	if (user.isSuccess) return <ProfileContent user={user.data} />;

	return <ProfileSkeleton />;
}
