import { useContext } from "react";
import { MatchPlaylistModalManagerContext } from "../contexts";

export function useMatchPlaylistModalManger() {
	return useContext(MatchPlaylistModalManagerContext);
}
