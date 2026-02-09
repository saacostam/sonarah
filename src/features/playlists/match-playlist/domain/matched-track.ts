import type { ITrack } from "@/features/playlists/shared/domain";

export interface IMatchedTrack {
	position: number;
	track: ITrack;
}
