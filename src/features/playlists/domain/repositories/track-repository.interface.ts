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
		tracks: ITrack[];
	};
}
