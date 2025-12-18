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
			uri: string;
			name: string;
			tracks: ITrack[];
		}[];
	};
}
