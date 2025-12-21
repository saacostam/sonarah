import type { IAuthAdapter } from "@/features/auth/domain";
import type { INavigationAdapter } from "@/features/navigation/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import type { IErrorLoggerAdapter } from "@/shared/adapters/errors/domain";
import type { INotificationAdapter } from "@/shared/adapters/notifications/domain";
import type { IStorageAdapter } from "@/shared/adapters/storage/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	errorLoggerAdapter: IErrorLoggerAdapter;
	notificationsAdapter: INotificationAdapter;
	routerAdapter: IRouterAdapter;
	navigationAdapter: INavigationAdapter;
	storageAdapter: IStorageAdapter;
}
