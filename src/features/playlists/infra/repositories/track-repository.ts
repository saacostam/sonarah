import type { IClientAdapter } from "@/features/clients/domain";
import type {
	ITrack,
	ITrackRepository,
	ITrackRepositoryPayload,
} from "../../domain";

export class TrackRepository implements ITrackRepository {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async getRecommendations(
		args: ITrackRepositoryPayload["GetRecommendationsIn"],
	): Promise<ITrackRepositoryPayload["GetRecommendationsOut"]> {
		const { name } = args;

		const params = new URLSearchParams({
			q: name,
			type: "playlist",
			limit: "1",
		});

		const searchResponse = await this.spotifyAuthClient.get<{
			playlists: {
				items: {
					id: string;
					name: string;
					images: { url: string }[];
				}[];
			};
		}>(`/v1/search?${params.toString()}`);

		const playlist = searchResponse.playlists.items.at(0);
		if (!playlist) {
			return { tracks: [] };
		}

		const playlistTracksResponse = await this.spotifyAuthClient.get<{
			items: {
				track?: {
					id: string;
					name: string;
					artists: { id: string; name: string }[];
					duration_ms: number;
					album: { images: { url: string }[] };
				};
			}[];
		}>(`/v1/playlists/${playlist.id}/tracks`);

		const tracks: ITrack[] = playlistTracksResponse.items
			.map((item) => item.track)
			.filter((track): track is NonNullable<typeof track> => !!track)
			.map((track) => ({
				id: track.id,
				name: track.name,
				artistNames: track.artists.map((a) => a.name),
				durationInMs: track.duration_ms,
				pictureUrl:
					track.album.images?.[0]?.url ?? playlist.images?.[0]?.url ?? null,
			}));

		return { tracks };
	}
}
