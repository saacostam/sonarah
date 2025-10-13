import { Button, type ButtonProps } from "@radix-ui/themes";
import { Link } from "react-router";
import type { IButtonAction } from "@/shared/types";

export interface PolymorphicButtonProps {
	action: IButtonAction;
	size?: ButtonProps["size"];
	variant?: ButtonProps["variant"];
}

export function PolymorphicButton({
	action,
	size,
	variant,
}: PolymorphicButtonProps) {
	return (
		<Button
			asChild={action.action.type === "href"}
			onClick={
				action.action.type === "button" ? action.action.onClick : undefined
			}
			size={size}
			variant={variant}
		>
			{action.action.type === "href" && (
				<Link to={action.action.href}>{action.label}</Link>
			)}
		</Button>
	);
}
