import type { ITrack } from "../entities";

export interface ITrackRepository {
	getRecommendations(
		args: ITrackRepositoryPayload["GetRecommendationsIn"],
	): Promise<ITrackRepositoryPayload["GetRecommendationsOut"]>;
}

export interface ITrackRepositoryPayload {
	GetRecommendationsIn: {
		name: string;
		artists: string[];
	};
	GetRecommendationsOut: {
		playlists: {
			id: string;
			name: string;
			tracks: ITrack[];
		}[];
	};
}
