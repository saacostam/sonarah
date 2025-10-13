import type { IAuthAdapter } from "@/features/auth/domain";
import type { IErrorLoggerAdapter } from "@/features/errors/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import type { IStorageAdapter } from "@/features/storage/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	errorLoggerAdapter: IErrorLoggerAdapter;
	routerAdapter: IRouterAdapter;
	storageAdapter: IStorageAdapter;
}
