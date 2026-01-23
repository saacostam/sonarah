import { Button, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { useMutationTransferPlayback } from "../app";

export interface TransferPlaybackProps {
	deviceId: string;
	onCancel: () => void;
	onSuccess: () => void;
}

export function TransferPlayback({
	deviceId,
	onCancel,
	onSuccess,
}: TransferPlaybackProps) {
	const { notificationsAdapter } = useAdapters();

	const transferPlayback = useMutationTransferPlayback();

	const onClickTransfer = useCallback(() => {
		transferPlayback.mutate(
			{
				deviceId,
			},
			{
				onSuccess,
				onError: () => {
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Error",
						"We couldn't transfer playback. Please try again.",
					);
				},
				onSettled: onCancel,
			},
		);
	}, [deviceId, notificationsAdapter, onCancel, onSuccess, transferPlayback]);

	return (
		<Flex direction="column" gap="4">
			<Text>
				Playback is not currently set to this device. Do you want to transfer
				playback?
			</Text>
			<Flex gap="4" justify="end">
				<Button color="red" type="button" onClick={onCancel} variant="outline">
					Cancel
				</Button>
				<Button
					loading={transferPlayback.isPending}
					onClick={onClickTransfer}
					type="button"
				>
					Transfer
				</Button>
			</Flex>
		</Flex>
	);
}
