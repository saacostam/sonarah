export enum INotificationAdapterType {
	SUCCESS = "success",
	ERROR = "error",
}

export interface INotificationAdapter {
	notify(
		type: INotificationAdapterType,
		title: string,
		msg: string,
		options?: {
			id?: string;
		},
	): Promise<string>;
}
