export enum INotificationAdapterType {
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning",
}

export interface INotificationAdapter {
	type: INotificationAdapterType;
}
