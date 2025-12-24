import { Button, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { useMutationUnfollowPlaylist } from "../../hooks";

export interface UnfollowPlaylistProps {
	id: string;
	onCancel: () => void;
	onSuccess: (args: IPlaylistRepositoryPayload["UnfollowOut"]) => void;
}

export function UnfollowPlaylist({
	id,
	onCancel,
	onSuccess,
}: UnfollowPlaylistProps) {
	const { notificationsAdapter } = useAdapters();

	const unfollowPlaylist = useMutationUnfollowPlaylist();

	const onClickUnfollow = useCallback(() => {
		unfollowPlaylist.mutate(
			{
				id,
			},
			{
				onSuccess,
				onError: () => {
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Error",
						"We couldn't unfollow the playlist. Please try again.",
					);
					onCancel();
				},
			},
		);
	}, [id, notificationsAdapter, onCancel, onSuccess, unfollowPlaylist]);

	return (
		<Flex direction="column" gap="4">
			<Text>Are you sure you want to unfollow this playlist</Text>
			<Flex gap="4" justify="end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					color="red"
					loading={unfollowPlaylist.isPending}
					onClick={onClickUnfollow}
					type="button"
				>
					Unfollow
				</Button>
			</Flex>
		</Flex>
	);
}
