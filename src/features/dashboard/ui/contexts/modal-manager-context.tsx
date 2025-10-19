import { createContext } from "react";

export interface IDashboardModalManager {
	status:
		| {
				type: "browse";
		  }
		| {
				type: "create-playlist";
		  };
	setStatus: (status: IDashboardModalManager["status"]) => void;
}

export const DashboardModalManagerContext = createContext(
	null as unknown as IDashboardModalManager,
);
