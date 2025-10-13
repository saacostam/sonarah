import { Button, type ButtonProps } from "@radix-ui/themes";
import type { IButtonAction } from "@/shared/types";

export interface PolymorphicButtonProps {
	action: IButtonAction;
	variant?: ButtonProps["variant"];
}

export function PolymorphicButton({ action, variant }: PolymorphicButtonProps) {
	return (
		<Button
			asChild={action.action.type === "href"}
			onClick={
				action.action.type === "button" ? action.action.onClick : undefined
			}
			variant={variant}
		>
			{action.action.type === "href" && <a href="/">{action.label}</a>}
		</Button>
	);
}
