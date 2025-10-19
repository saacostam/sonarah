import { Flex, Heading, Text } from "@radix-ui/themes";
import { XIcon } from "@/features/icons";

export interface ToastProps {
	description: string;
	title: string;
	onClose: () => void;
}

export function Toast({ description, title, onClose }: ToastProps) {
	return (
		<Flex direction="row" align="start">
			<Flex direction="column" width="256px">
				<Heading size="3">{title}</Heading>
				<Text size="2">{description}</Text>
			</Flex>
			<button
				type="button"
				style={{
					padding: "0.05rem",
					backgroundColor: "transparent",
					width: "fit-content",
					height: "fit-content",
					color: "black",
					border: "none",
					cursor: "pointer",
				}}
				onClick={onClose}
			>
				<XIcon height={16} width={16} />
			</button>
		</Flex>
	);
}
