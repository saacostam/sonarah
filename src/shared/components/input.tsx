import { Text, TextField } from "@radix-ui/themes";
import type { useForm } from "react-hook-form";
import { InlineErrorMessage } from "./inline-error-message";

export type InputProps = ReturnType<ReturnType<typeof useForm>["register"]> & {
	label: string;
	error: string | null;
};

export function Input(props: InputProps) {
	const { label, error, ...rest } = props;

	return (
		<>
			<Text>{label}</Text>
			<TextField.Root placeholder={label} {...rest} />
			{error && <InlineErrorMessage>{error}</InlineErrorMessage>}
		</>
	);
}
