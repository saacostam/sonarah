import { Button, Dialog, Flex } from "@radix-ui/themes";
import {
	type PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { INotificationAdapterType } from "@/shared/adapters/notifications/domain";
import { XIcon } from "@/shared/icons";
import {
	useMutationPausePlayback,
	useMutationPlayTrackOfPlaylist,
	useMutationSeekToPosition,
	useMutationStartPlayback,
	WebPlayerManagerContext,
} from "../app";
import type { IWebPlayerManager } from "../domain";
import { TransferPlayback } from "./transfer-playback";

export function WebPlayerManagerProvider({ children }: PropsWithChildren) {
	const { notificationsAdapter, webPlayerAdapter } = useAdapters();

	const [playbackModal, setPlaybackModal] = useState<
		| { type: "open"; deviceId: string; onSuccess: () => void }
		| {
				type: "closed";
		  }
	>({
		type: "closed",
	});

	const onClosePlaybackModal = useCallback(() => {
		setPlaybackModal({
			type: "closed",
		});
	}, []);

	const pausePlaybackMutation = useMutationPausePlayback();
	const playTrackOfPlaylistMutation = useMutationPlayTrackOfPlaylist();
	const seekToPositionMutation = useMutationSeekToPosition();
	const startPlaybackMutation = useMutationStartPlayback();

	const startPlayback: Extract<
		IWebPlayerManager,
		{ status: "ready" }
	>["startPlayback"]["onClick"] = useCallback(() => {
		if (webPlayerAdapter.status.type !== "running") {
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				"Something went wrong with web player playback",
			);
			return;
		}

		const onSuccess = () =>
			startPlaybackMutation.mutate(undefined, {
				onError: () => {
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Error",
						"Unnable to start playback. Please try again.",
					);
				},
			});

		if (webPlayerAdapter.status.payload.state === null) {
			setPlaybackModal({
				type: "open",
				onSuccess,
				deviceId: webPlayerAdapter.status.payload.deviceId,
			});
			return;
		}
		onSuccess();
	}, [notificationsAdapter, startPlaybackMutation, webPlayerAdapter.status]);

	const pausePlayback: Extract<
		IWebPlayerManager,
		{ status: "ready" }
	>["pausePlayback"]["onClick"] = useCallback(() => {
		if (webPlayerAdapter.status.type !== "running") {
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				"Something went wrong with web player playback",
			);
			return;
		}

		const onSuccess = () =>
			pausePlaybackMutation.mutate(undefined, {
				onError: () => {
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Error",
						"Unnable to pause playback. Please try again.",
					);
				},
			});

		if (webPlayerAdapter.status.payload.state === null) {
			setPlaybackModal({
				type: "open",
				onSuccess,
				deviceId: webPlayerAdapter.status.payload.deviceId,
			});
			return;
		}

		onSuccess();
	}, [notificationsAdapter, pausePlaybackMutation, webPlayerAdapter.status]);

	const seekToPosition: Extract<
		IWebPlayerManager,
		{ status: "ready" }
	>["seekToPosition"]["onClick"] = useCallback(
		(args) => {
			if (webPlayerAdapter.status.type !== "running") {
				notificationsAdapter.notify(
					INotificationAdapterType.ERROR,
					"Error",
					"Something went wrong with web player playback",
				);
				return;
			}

			const onSuccess = () => {
				if (webPlayerAdapter.status.type !== "running") return;
				seekToPositionMutation.mutate(
					{
						...args,
						deviceId: webPlayerAdapter.status.payload.deviceId,
					},
					{
						onError: () => {
							notificationsAdapter.notify(
								INotificationAdapterType.ERROR,
								"Error",
								"Unnable to update playback position. Please try again.",
							);
						},
					},
				);
			};

			if (webPlayerAdapter.status.payload.state === null) {
				setPlaybackModal({
					type: "open",
					onSuccess,
					deviceId: webPlayerAdapter.status.payload.deviceId,
				});
				return;
			}

			onSuccess();
		},
		[notificationsAdapter, seekToPositionMutation, webPlayerAdapter.status],
	);

	const playTrackOfPlaylist: Extract<
		IWebPlayerManager,
		{ status: "ready" }
	>["playTrackOfPlaylist"]["onClick"] = useCallback(
		(args) => {
			if (webPlayerAdapter.status.type !== "running") {
				notificationsAdapter.notify(
					INotificationAdapterType.ERROR,
					"Error",
					"Something went wrong with web player playback",
				);
				return;
			}

			const onSuccess = () => {
				if (webPlayerAdapter.status.type !== "running") return;
				playTrackOfPlaylistMutation.mutate(args, {
					onError: () => {
						notificationsAdapter.notify(
							INotificationAdapterType.ERROR,
							"Error",
							"Unnable to play track. Please try again.",
						);
					},
				});
			};

			if (webPlayerAdapter.status.payload.state === null) {
				setPlaybackModal({
					type: "open",
					onSuccess,
					deviceId: webPlayerAdapter.status.payload.deviceId,
				});
				return;
			}

			onSuccess();
		},
		[
			notificationsAdapter,
			playTrackOfPlaylistMutation,
			webPlayerAdapter.status,
		],
	);

	const mutations = useMemo(
		() => ({
			pausePlayback: {
				onClick: pausePlayback,
				isPending: pausePlaybackMutation.isPending,
			},
			playTrackOfPlaylist: {
				onClick: playTrackOfPlaylist,
				isPending: playTrackOfPlaylistMutation.isPending,
			},
			seekToPosition: {
				onClick: seekToPosition,
				isPending: seekToPositionMutation.isPending,
			},
			startPlayback: {
				onClick: startPlayback,
				isPending: startPlaybackMutation.isPending,
			},
		}),
		[
			pausePlayback,
			pausePlaybackMutation,
			playTrackOfPlaylist,
			playTrackOfPlaylistMutation,
			seekToPosition,
			seekToPositionMutation,
			startPlayback,
			startPlaybackMutation,
		],
	);

	const { mutate } = pausePlaybackMutation;
	useEffect(() => {
		return () => {
			mutate();
		};
	}, [mutate]);

	const webPlayerManager: IWebPlayerManager = useMemo(
		() =>
			webPlayerAdapter.status.type === "pending"
				? {
						status: "loading",
					}
				: webPlayerAdapter.status.type === "failed"
					? {
							status: "failed",
						}
					: webPlayerAdapter.status.payload.state === null
						? {
								status: "playback-not-available",
								...mutations,
								openTransferPlaybackModal: () => {
									if (webPlayerAdapter.status.type !== "running") return;
									setPlaybackModal({
										type: "open",
										deviceId: webPlayerAdapter.status.payload.deviceId,
										onSuccess: () => {
											notificationsAdapter.notify(
												INotificationAdapterType.SUCCESS,
												"Success",
												"Playback was transfered",
											);
										},
									});
								},
							}
						: {
								status: "ready",
								state: webPlayerAdapter.status.payload.state,
								...mutations,
							},
		[mutations, notificationsAdapter, webPlayerAdapter.status],
	);

	return (
		<WebPlayerManagerContext.Provider value={webPlayerManager}>
			{children}
			<Dialog.Root
				open={playbackModal.type === "open"}
				onOpenChange={onClosePlaybackModal}
			>
				<Dialog.Content maxWidth="512px">
					<Flex direction="row" gap="2" justify="between">
						<Dialog.Title size="7">Transfer Playback</Dialog.Title>
						<Button onClick={onClosePlaybackModal} variant="ghost">
							<XIcon height={20} width={20} />
						</Button>
					</Flex>
					{playbackModal.type === "open" && (
						<TransferPlayback
							deviceId={playbackModal.deviceId}
							onCancel={onClosePlaybackModal}
							onSuccess={playbackModal.onSuccess}
						/>
					)}
				</Dialog.Content>
			</Dialog.Root>
		</WebPlayerManagerContext.Provider>
	);
}
