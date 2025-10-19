import { Box, Button, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import { InlineErrorMessage, Input } from "@/shared/components";
import { getErrorMessage } from "@/shared/utils";
import {
	type ICreatePlaylistForm,
	useCreatePlaylistForm,
	useMutationCreatePlaylist,
} from "../../hooks";

export interface CreatePlaylistContentProps {
	onCancel: () => void;
	userId: string;
}

export function CreatePlaylistContent({
	onCancel,
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
					onSuccess: () => onCancel(),
				},
			);
		},
		[createPlaylistForm, onCancel, mutateCreatePlaylist, userId],
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
