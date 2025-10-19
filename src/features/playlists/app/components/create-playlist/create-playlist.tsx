import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";

export interface CreatePlaylistProps {
	onCancel: () => void;
}

export function CreatePlaylist({ onCancel }: CreatePlaylistProps) {
	return (
		<form>
			<Flex direction="column" gap="6">
				<Box>
					<Text>Name</Text>
					<TextField.Root placeholder="Name" />
				</Box>
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
