import { Box, Button, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { useAdapters } from "@/features/adapters/app";
import { INotificationAdapterType } from "@/features/notifications/domain";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/domain";
import { InlineErrorMessage, Input } from "@/shared/components";
import { getErrorMessage } from "@/shared/utils";
import {
	type ICreatePlaylistForm,
	useCreatePlaylistForm,
	useMutationCreatePlaylist,
} from "../../hooks";

export interface CreatePlaylistContentProps {
	onCancel: () => void;
	onSuccess: (args: IPlaylistRepositoryPayload["CreatePlaylistOut"]) => void;
	userId: string;
}

export function CreatePlaylistContent({
	onCancel,
	onSuccess,
	userId,
}: CreatePlaylistContentProps) {
	const { notificationsAdapter } = useAdapters();

	const { mutate: mutateCreatePlaylist, isPending: createPlaylistIsPending } =
		useMutationCreatePlaylist();

	const createPlaylistForm = useCreatePlaylistForm();
	const { errors } = createPlaylistForm.formState;

	const submit = useCallback(
		(args: ICreatePlaylistForm) => {
			mutateCreatePlaylist(
				{
					name: args.name,
					userId,
					visibility: "private",
				},
				{
					onError: (error) =>
						createPlaylistForm.setError("root", {
							type: "server",
							message: getErrorMessage(
								error,
								"Unable to create playlist right now.",
							),
						}),
					onSuccess: (args) => {
						notificationsAdapter.notify(
							INotificationAdapterType.SUCCESS,
							"Added",
							"Playlist added successfully",
						);

						onSuccess(args);
					},
				},
			);
		},
		[
			createPlaylistForm,
			onSuccess,
			mutateCreatePlaylist,
			notificationsAdapter,
			userId,
		],
	);

	return (
		<form onSubmit={createPlaylistForm.handleSubmit(submit)}>
			<Flex direction="column" gap="6">
				<Box>
					<Input
						label="Name"
						{...createPlaylistForm.register("name")}
						error={errors.name?.message || null}
					/>
				</Box>
				{errors.root?.message && (
					<InlineErrorMessage>{errors.root?.message}</InlineErrorMessage>
				)}
				<Flex gap="4" justify="end">
					<Button type="submit" loading={createPlaylistIsPending}>
						Create
					</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
}
