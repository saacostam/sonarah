import type { IUser } from "../entities";

export interface IUserRepository {
	getUser(): Promise<IUser>;
}
