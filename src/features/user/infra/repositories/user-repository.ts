import type { IClientAdapter } from "@/features/clients/domain";
import type { IUser, IUserRepository } from "../../domain";

export class UserRepository implements IUserRepository {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async getUser(): Promise<IUser> {
		const res = await this.spotifyAuthClient.get<{
			id: string;
			display_name: string;
			images: {
				url: string;
			}[];
		}>("/v1/me");

		return {
			id: res.id,
			name: res.display_name,
			profilePicture: res.images.at(0)?.url,
		};
	}
}
