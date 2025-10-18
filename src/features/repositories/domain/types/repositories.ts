import type { IUserRepository } from "@/features/user/domain";

export interface IRepositories {
	user: IUserRepository;
}
