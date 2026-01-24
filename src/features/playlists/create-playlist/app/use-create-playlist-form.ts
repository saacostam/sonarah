import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const CreatePlaylistFormSchema = z.object({
	name: z
		.string()
		.min(1, "Required")
		.max(50, "Playlist name can't be longer than 50 characters"),
});

export type ICreatePlaylistForm = z.infer<typeof CreatePlaylistFormSchema>;

export function useCreatePlaylistForm() {
	return useForm({
		defaultValues: {
			name: "",
		},
		resolver: zodResolver(CreatePlaylistFormSchema),
	});
}
