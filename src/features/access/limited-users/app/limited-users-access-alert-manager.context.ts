import { createContext } from "react";
import type { ILimitedUsersAccessAlertManager } from "../domain";

export const LimitedUsersAccessAlertManagerContext =
	createContext<ILimitedUsersAccessAlertManager | null>(null);
