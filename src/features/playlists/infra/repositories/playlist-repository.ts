import type { IClientAdapter } from "@/features/clients/domain";
import type {
	IPlaylistRepository,
	IPlaylistRepositoryPayload,
} from "../../domain";

export class PlaylistRepository implements IPlaylistRepository {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async getAll(
		args: IPlaylistRepositoryPayload["GetAllIn"],
	): Promise<IPlaylistRepositoryPayload["GetAllOut"]> {
		const { page, limit } = args;

		const urlParams = new URLSearchParams();
		urlParams.append("limit", String(limit));
		urlParams.append("offset", String(limit * (page - 1)));

		const res = await this.spotifyAuthClient.get<{
			total: number;
			items: {
				id: string;
				images: {
					url: string;
				}[];
				name: string;
				owner: {
					display_name: string;
				};
				tracks: {
					total: number;
				};
			}[];
		}>(`/v1/me/playlists?${urlParams.toString()}`);

		return {
			page: page,
			total: res.total,
			playlists: res.items.map((item) => ({
				id: item.id,
				name: item.name,
				creatorName: item.owner.display_name,
				pictureUrl: item.images.at(0)?.url,
				numberOfTracks: item.tracks.total,
			})),
		};
	}
}
