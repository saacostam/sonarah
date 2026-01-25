import type { IPaginatedTracks, ITrack } from "../entities";

export interface ITrackRepository {
	getRecommendations(
		args: ITrackRepositoryPayload["GetRecommendationsIn"],
	): Promise<ITrackRepositoryPayload["GetRecommendationsOut"]>;
	search(
		args: ITrackRepositoryPayload["SearchIn"],
	): Promise<ITrackRepositoryPayload["SearchOut"]>;
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
	SearchIn: {
		limit: number;
		q: string;
		page: number;
	};
	SearchOut: IPaginatedTracks;
}
