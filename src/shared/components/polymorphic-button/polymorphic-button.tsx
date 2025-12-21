import { Button, type ButtonProps } from "@radix-ui/themes";
import { Link } from "react-router";
import type { IAction } from "@/shared/types";

export interface PolymorphicButtonProps extends ButtonProps {
	action: IAction;
}

export function PolymorphicButton(props: PolymorphicButtonProps) {
	const { action, style, ...rest } = props;

	return (
		<Button
			asChild={action.action.type === "href"}
			onClick={
				action.action.type === "button" ? action.action.onClick : undefined
			}
			style={{
				cursor: "pointer",
				...style,
			}}
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
