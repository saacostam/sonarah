import {
	type INotificationAdapter,
	INotificationAdapterType,
} from "@/shared/adapters/notifications/domain";
import type { IWebPlayerAdapter } from "@/shared/adapters/web-player/domain";
import type { IWebPlayerManagerModal } from "../../domain";

type PlaybackActionFactoryParams<TArgs> = {
	webPlayerStatus: IWebPlayerAdapter["status"];
	notificationsAdapter: INotificationAdapter;
	setPlaybackModal: (arg: IWebPlayerManagerModal) => void;

	mutate: (args: TArgs, options: { onError: () => void }) => void;

	errorMessage: string;
};

export function createPlaybackAction<TArgs>({
	webPlayerStatus,
	notificationsAdapter,
	setPlaybackModal,
	mutate,
	errorMessage,
}: PlaybackActionFactoryParams<TArgs>) {
	return (args: TArgs) => {
		if (webPlayerStatus.type !== "running") {
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Error",
				"Something went wrong with web player playback",
			);
			return;
		}

		const onSuccess = () => {
			if (webPlayerStatus.type !== "running") return;

			mutate(args, {
				onError: () => {
					notificationsAdapter.notify(
						INotificationAdapterType.ERROR,
						"Error",
						errorMessage,
					);
				},
			});
		};

		if (webPlayerStatus.payload.state === null) {
			setPlaybackModal({
				type: "open",
				onSuccess,
				deviceId: webPlayerStatus.payload.deviceId,
			});
			return;
		}

		onSuccess();
	};
}
