import { useContext } from "react";
import { MatchPlaylistModalManagerContext } from "./match-playlist-modal-manager.context";

export function useMatchPlaylistModalManger() {
	return useContext(MatchPlaylistModalManagerContext);
}
