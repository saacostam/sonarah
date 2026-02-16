import { useContext } from "react";
import { LimitedUsersAccessAlertManagerContext } from "./limited-users-access-alert-manager.context";

export function useLimitedUsersAccessAlertManager() {
	return useContext(LimitedUsersAccessAlertManagerContext);
}
