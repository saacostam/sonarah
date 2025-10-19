import { Box, Button, Flex } from "@radix-ui/themes";
import { InlineErrorMessage, Input } from "@/shared/components";
import { useCreatePlaylistForm } from "../../hooks";

export interface CreatePlaylistProps {
	onCancel: () => void;
}

export function CreatePlaylist({ onCancel }: CreatePlaylistProps) {
	const createPlaylistForm = useCreatePlaylistForm();
	const { errors } = createPlaylistForm.formState;

	return (
		<form onSubmit={createPlaylistForm.handleSubmit(console.log)}>
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
					<Button type="submit">Create</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
}
