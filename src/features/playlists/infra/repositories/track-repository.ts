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
		const { name, artists } = args;

		const params = new URLSearchParams({
			q: `${artists.join(" ")} ${name}`,
			type: "playlist",
			limit: String(4),
		});

		const searchResponse = await this.spotifyAuthClient.get<{
			playlists: {
				items: ({
					id: string;
					name: string;
					images: { url: string }[];
					tracks: {
						total: number;
					};
				} | null)[];
			};
		}>(`/v1/search?${params.toString()}`);

		const playlistsToQuery = [...searchResponse.playlists.items].filter(
			(item) => item !== null,
		);

		const playlistsTracksResponse = await Promise.all(
			playlistsToQuery.map(async (playlist) => {
				const res = await this.spotifyAuthClient.get<{
					items: {
						track?: {
							id: string;
							uri: string;
							name: string;
							artists: { id: string; name: string }[];
							duration_ms: number;
							album: { images: { url: string }[] };
						};
					}[];
				}>(`/v1/playlists/${playlist.id}/tracks`);

				return {
					id: playlist.id,
					...res,
				};
			}),
		);

		const playlistsRecommendations: ITrackRepositoryPayload["GetRecommendationsOut"]["playlists"] =
			[];

		for (const playlist of playlistsToQuery) {
			const playlistsResponse = playlistsTracksResponse.find(
				(tracks) => tracks.id === playlist.id,
			);

			if (!playlistsResponse) continue;

			const tracks: ITrack[] = playlistsResponse.items
				.map((item) => item.track)
				.filter((track): track is NonNullable<typeof track> => !!track)
				.map((track) => ({
					id: track.id,
					name: track.name,
					artistNames: track.artists.map((a) => a.name),
					durationInMs: track.duration_ms,
					pictureUrl:
						track.album.images?.[0]?.url ?? playlist.images?.[0]?.url ?? null,
					uri: track.uri,
				}));

			playlistsRecommendations.push({
				id: playlist.id,
				name: playlist.name,
				tracks,
			});
		}

		return {
			playlists: playlistsRecommendations,
		};
	}
}
