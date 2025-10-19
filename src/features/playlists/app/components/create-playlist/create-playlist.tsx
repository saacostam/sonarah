import { useQueryUser } from "@/features/user/app";
import { QueryError } from "@/shared/components";
import { CreatePlaylistContent } from "./create-playlist-content";
import { CreatePlaylistSkeleton } from "./create-playlist-skeleton";

export interface CreatePlaylistProps {
	onCancel: () => void;
}

export function CreatePlaylist({ onCancel }: CreatePlaylistProps) {
	const user = useQueryUser();

	if (user.isError)
		return (
			<QueryError
				error={user.error}
				title="Unable to fetch user"
				retry={{ onClick: user.refetch, isPending: user.isPending }}
			/>
		);
	if (user.isSuccess)
		return <CreatePlaylistContent onCancel={onCancel} userId={user.data.id} />;

	return <CreatePlaylistSkeleton />;
}
