import { Button, Flex, Text } from "@radix-ui/themes";
import { useCallback } from "react";
import { useMutationTransferPlayback } from "../app";

export interface TransferPlaybackProps {
	deviceId: string;
	onCancel: () => void;
	onError: (e: unknown) => void;
	onSuccess: () => void;
}

export function TransferPlayback({
	deviceId,
	onCancel,
	onError,
	onSuccess,
}: TransferPlaybackProps) {
	const transferPlayback = useMutationTransferPlayback();

	const onClickTransfer = useCallback(() => {
		transferPlayback.mutate(
			{
				deviceId,
			},
			{
				onSuccess,
				onError,
				onSettled: onCancel,
			},
		);
	}, [deviceId, onCancel, onError, onSuccess, transferPlayback]);

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
