import { Button, type ButtonProps } from "@radix-ui/themes";
import { Link } from "react-router";
import type { IButtonAction } from "@/shared/types";

export interface PolymorphicButtonProps extends ButtonProps {
	action: IButtonAction;
}

export function PolymorphicButton(props: PolymorphicButtonProps) {
	const { action, ...rest } = props;

	return (
		<Button
			asChild={action.action.type === "href"}
			onClick={
				action.action.type === "button" ? action.action.onClick : undefined
			}
			{...rest}
		>
			{action.action.type === "href" ? (
				<Link to={action.action.href}>{action.label}</Link>
			) : (
				action.label
			)}
		</Button>
	);
}
