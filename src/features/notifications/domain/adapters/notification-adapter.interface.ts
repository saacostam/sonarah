export enum INotificationAdapterType {
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning",
}

export interface INotificationAdapter {
	notify(type: INotificationAdapterType, msg: string): Promise<void>;
}
