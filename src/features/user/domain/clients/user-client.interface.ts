import type { IUser } from "../entities";

export interface IUserClient {
	getUser(): Promise<IUser>;
}
