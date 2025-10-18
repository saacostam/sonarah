import type { IClientAdapter } from "@/features/clients/domain";
import type { IUser, IUserRepository } from "../../domain";

export class UserRepository implements IUserRepository {
	constructor(private spotifyAuthClient: IClientAdapter) {}

	async getUser(): Promise<IUser> {
		const res = await this.spotifyAuthClient.get<{
			id: string;
			country: string;
			display_name: string;
			email: string;
			images: {
				url: string;
			}[];
		}>("/v1/me");

		return {
			id: res.id,
			country: res.country,
			email: res.email,
			name: res.display_name,
			profilePicture: res.images.at(0)?.url,
		};
	}
}
