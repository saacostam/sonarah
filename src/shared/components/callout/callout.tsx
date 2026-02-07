import { Button, Flex, Callout as RadixCallout } from "@radix-ui/themes";
import { type PropsWithChildren, type ReactNode, useState } from "react";
import { InformationCircleIcon, XIcon } from "@/shared/icons";

export type CalloutProps = RadixCallout.RootProps & {
	icon?: ReactNode;
	dismissable?: boolean;
	dismissed?: {
		value: boolean;
		onDismiss: () => void;
	};
};

export function Callout({
	children,
	icon,
	dismissable = true,
	dismissed,
	...rest
}: PropsWithChildren<CalloutProps>) {
	const [internalDismissed, setInternalDismissed] = useState(false);

	const isDismissed = dismissed ? dismissed.value : internalDismissed;
	if (isDismissed) return null;

	return (
		<RadixCallout.Root size="1" variant="surface" {...rest}>
			<RadixCallout.Icon>
				{icon ?? <InformationCircleIcon height={20} width={20} />}
			</RadixCallout.Icon>

			<Flex gap="1" align="start">
				<RadixCallout.Text style={{ flex: 1 }}>{children}</RadixCallout.Text>

				{dismissable && (
					<Button
						size="1"
						variant="ghost"
						onClick={
							dismissed ? dismissed.onDismiss : () => setInternalDismissed(true)
						}
						style={{ padding: "0.3rem" }}
					>
						<XIcon height={16} width={16} />
					</Button>
				)}
			</Flex>
		</RadixCallout.Root>
	);
}
