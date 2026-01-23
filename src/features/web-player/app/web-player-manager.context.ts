import { createContext, useContext } from "react";
import type { IWebPlayerManager } from "../domain";

export const WebPlayerManagerContext = createContext(
	null as unknown as IWebPlayerManager,
);

export function useWebPlayerManager() {
	return useContext(WebPlayerManagerContext);
}
