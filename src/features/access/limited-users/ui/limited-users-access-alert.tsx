import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { XIcon } from "@/shared/icons";
import { useLimitedUsersAccessAlertManager } from "../app";

export function LimitedUsersAccessAlert() {
	const manager = useLimitedUsersAccessAlertManager();

	const onClose = useCallback(
		() => manager?.setStatus({ type: "closed" }),
		[manager],
	);

	return (
		<Dialog.Root open={manager?.status.type === "open"}>
			<Dialog.Content maxWidth="512px">
				<Flex direction="row" gap="2" justify="between">
					<Dialog.Title>Temporary Limitation</Dialog.Title>
					<Button onClick={onClose} variant="ghost">
						<XIcon height={20} width={20} />
					</Button>
				</Flex>
				<Flex direction="column" gap="4">
					<Text>
						Sorry! The app isn&apos;t working yet due to temporary service
						restrictions. Logging in won&apos;t give access to any features.
					</Text>
					<Flex gap="4" justify="end">
						<Button type="button" variant="outline" onClick={onClose}>
							Go back
						</Button>
						<Button
							color="red"
							// This should only shows when status.type === "open"
							onClick={
								manager?.status.type === "open"
									? manager.status.onContinue
									: undefined
							}
							type="button"
						>
							Continue anyway
						</Button>
					</Flex>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
}
