import type { IAuthAdapter } from "@/features/auth/domain";
import type { IErrorLoggerAdapter } from "@/features/errors/domain";
import type { INotificationAdapter } from "@/features/notifications/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import type { IRoutesAdapter } from "@/features/routes/domain";
import type { IStorageAdapter } from "@/features/storage/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	errorLoggerAdapter: IErrorLoggerAdapter;
	notificationsAdapter: INotificationAdapter;
	routerAdapter: IRouterAdapter;
	routesAdapter: IRoutesAdapter;
	storageAdapter: IStorageAdapter;
}
