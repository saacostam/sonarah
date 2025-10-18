import { useQueryUser } from "@/features/user/app";
import { ProfileContent } from "./profile-content";
import { ProfileSkeleton } from "./profile-skeleton";

export function Profile() {
	const user = useQueryUser();

	if (user.isError) return null;
	if (user.isSuccess) return <ProfileContent user={user.data} />;

	return <ProfileSkeleton />;
}
