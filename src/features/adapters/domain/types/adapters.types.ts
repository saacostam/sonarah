import type { IAuthAdapter } from "@/features/auth/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import type { IStorageAdapter } from "@/features/storage/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	routerAdapter: IRouterAdapter;
	storageAdapter: IStorageAdapter;
}
