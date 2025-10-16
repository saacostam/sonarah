import { createContext } from "react";
import type { INotificationAdapter } from "../../domain";

export const NotificationsContext = createContext(
	null as unknown as INotificationAdapter,
);
