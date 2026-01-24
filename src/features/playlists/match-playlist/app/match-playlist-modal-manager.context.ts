import { createContext } from "react";
import type { IMatchPlaylistModalManager } from "../domain";

export const MatchPlaylistModalManagerContext = createContext(
	null as unknown as IMatchPlaylistModalManager,
);
