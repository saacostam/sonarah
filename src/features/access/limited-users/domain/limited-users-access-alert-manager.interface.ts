export interface ILimitedUsersAccessAlertManager {
	status: { type: "closed" } | { type: "open"; onContinue: () => void };
	setStatus: (status: ILimitedUsersAccessAlertManager["status"]) => void;
}
