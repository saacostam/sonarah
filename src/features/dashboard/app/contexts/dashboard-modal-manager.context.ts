import { createContext } from "react";
import type { IDashboardModalManager } from "../../domain";

export const DashboardModalManagerContext = createContext(
	null as unknown as IDashboardModalManager,
);
