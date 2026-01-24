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
	createPlaybackAction,
	useMutationPausePlayback,
	useMutationPlayTrackOfPlaylist,
	useMutationSeekToPosition,
	useMutationStartPlayback,
	WebPlayerManagerContext,
} from "../app";
import type {
	IWebPlayerManager,
	IWebPlayerManagerModal,
	IWebPlayerRepositoryPayload,
} from "../domain";
import { TransferPlayback } from "./transfer-playback";

export function WebPlayerManagerProvider({ children }: PropsWithChildren) {
	const { notificationsAdapter, webPlayerAdapter } = useAdapters();

	// Modal management
	const [playbackModal, setPlaybackModal] = useState<IWebPlayerManagerModal>({
		type: "closed",
	});
	const onClosePlaybackModal = useCallback(() => {
		setPlaybackModal({
			type: "closed",
		});
	}, []);

	// Actions
	const pausePlaybackMutation = useMutationPausePlayback();
	const playTrackOfPlaylistMutation = useMutationPlayTrackOfPlaylist();
	const seekToPositionMutation = useMutationSeekToPosition();
	const startPlaybackMutation = useMutationStartPlayback();

	const startPlayback = useMemo(
		() =>
			createPlaybackAction<void>({
				webPlayerAdapter,
				notificationsAdapter,
				setPlaybackModal,
				mutate: (_, options) =>
					startPlaybackMutation.mutate(undefined, options),
				errorMessage: "Unnable to start playback. Please try again.",
			}),
		[webPlayerAdapter, notificationsAdapter, startPlaybackMutation],
	);

	const pausePlayback = useMemo(
		() =>
			createPlaybackAction<void>({
				webPlayerAdapter,
				notificationsAdapter,
				setPlaybackModal,
				mutate: (_, options) =>
					pausePlaybackMutation.mutate(undefined, options),
				errorMessage: "Unnable to pause playback. Please try again.",
			}),
		[webPlayerAdapter, notificationsAdapter, pausePlaybackMutation],
	);

	const seekToPosition = useMemo(
		() =>
			createPlaybackAction<
				Omit<IWebPlayerRepositoryPayload["SeekToPositionIn"], "deviceId">
			>({
				webPlayerAdapter,
				notificationsAdapter,
				setPlaybackModal,
				mutate: (args) =>
					seekToPositionMutation.mutate({
						...args,
						deviceId:
							webPlayerAdapter.status.type === "running"
								? webPlayerAdapter.status.payload.deviceId
								: "",
					}),
				errorMessage: "Unnable to update playback position. Please try again.",
			}),
		[webPlayerAdapter, notificationsAdapter, seekToPositionMutation],
	);

	const playTrackOfPlaylist = useMemo(
		() =>
			createPlaybackAction<
				IWebPlayerRepositoryPayload["PlayTrackOfPlaylistIn"]
			>({
				webPlayerAdapter,
				notificationsAdapter,
				setPlaybackModal,
				mutate: playTrackOfPlaylistMutation.mutate,
				errorMessage: "Unnable to play track. Please try again.",
			}),
		[notificationsAdapter, playTrackOfPlaylistMutation, webPlayerAdapter],
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
				onClick: webPlayerAdapter.actions.seek ?? seekToPosition,
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
			webPlayerAdapter.actions.seek,
		],
	);

	// Clean-up
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
							onError={() => {
								notificationsAdapter.notify(
									INotificationAdapterType.ERROR,
									"Error",
									"We couldn't transfer playback. Please try again.",
								);
							}}
							onSuccess={playbackModal.onSuccess}
						/>
					)}
				</Dialog.Content>
			</Dialog.Root>
		</WebPlayerManagerContext.Provider>
	);
}
