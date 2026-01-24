import { Box, Button, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { useMutationCreatePlaylist } from "@/features/playlists/shared/app";
import type { IPlaylistRepositoryPayload } from "@/features/playlists/shared/domain";
import { InlineErrorMessage, Input } from "@/shared/components";
import { getErrorMessage } from "@/shared/utils";
import { type ICreatePlaylistForm, useCreatePlaylistForm } from "../app";

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
					onSuccess: onSuccess,
				},
			);
		},
		[createPlaylistForm, onSuccess, mutateCreatePlaylist, userId],
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
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" loading={createPlaylistIsPending}>
						Create
					</Button>
				</Flex>
			</Flex>
		</form>
	);
}
