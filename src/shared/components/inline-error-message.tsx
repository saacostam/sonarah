import { Text } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { ExclamationTriangleIcon } from "../icons";

export function InlineErrorMessage({ children }: PropsWithChildren) {
	return (
		<Text
			color="red"
			size="2"
			style={{
				display: "inline-flex",
				gap: "0.5rem",
				alignItems: "center",
				marginTop: "0.2rem",
			}}
		>
			<ExclamationTriangleIcon height={16} width={16} /> {children}
		</Text>
	);
}
