import { useContext } from "react";
import { DashboardModalManagerContext } from "../contexts";

export function useDashboardModalManager() {
	return useContext(DashboardModalManagerContext);
}
