import toast, { type ToastOptions } from "react-hot-toast";
import {
	type INotificationAdapter,
	INotificationAdapterType,
} from "../../domain";
import { Toast } from "../../ui";

export class ReactHotToastNotificationAdapter implements INotificationAdapter {
	async notify(
		type: INotificationAdapterType,
		title: string,
		msg: string,
		options?: {
			id?: string;
		},
	): Promise<string> {
		const sharedToastOptions: ToastOptions = {
			id: options?.id,
		};

		switch (type) {
			case INotificationAdapterType.ERROR: {
				return toast.error(
					(t) => (
						<Toast
							description={msg}
							title={title}
							onClose={() => toast.dismiss(t.id)}
						/>
					),
					sharedToastOptions,
				);
			}
			case INotificationAdapterType.SUCCESS: {
				return toast.success(
					(t) => (
						<Toast
							description={msg}
							title={title}
							onClose={() => toast.dismiss(t.id)}
						/>
					),
					sharedToastOptions,
				);
			}
		}
	}
}
