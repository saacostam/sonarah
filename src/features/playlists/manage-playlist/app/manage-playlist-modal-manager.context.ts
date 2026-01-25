import { createContext, useContext } from "react";
import type { IManagePlaylistModalManager } from "../domain";

export const ManagePlaylistModalManagerContext = createContext(
	null as unknown as IManagePlaylistModalManager,
);

export function useManagePlaylistModalManager() {
	return useContext(ManagePlaylistModalManagerContext);
}
