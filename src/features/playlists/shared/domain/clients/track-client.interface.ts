import type { IPaginatedTracks, ITrack } from "../entities";

export interface ITrackClient {
	getRecommendations(
		args: ITrackClientPayload["GetRecommendationsIn"],
	): Promise<ITrackClientPayload["GetRecommendationsOut"]>;
	search(
		args: ITrackClientPayload["SearchIn"],
	): Promise<ITrackClientPayload["SearchOut"]>;
}

export interface ITrackClientPayload {
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
