import type { ITrack } from "@/features/playlists/shared/domain";

export interface IMatchedTrack {
	referenceTrackId: string;
	newTrack: ITrack;
}
