import type { IAuthAdapter } from "@/features/auth/domain";
import type { IErrorLoggerAdapter } from "@/features/errors/domain";
import type { INavigationAdapter } from "@/features/navigation/domain";
import type { INotificationAdapter } from "@/features/notifications/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import type { IStorageAdapter } from "@/features/storage/domain";
import type { IWebPlayerAdapter } from "@/features/web-player/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	errorLoggerAdapter: IErrorLoggerAdapter;
	notificationsAdapter: INotificationAdapter;
	routerAdapter: IRouterAdapter;
	navigationAdapter: INavigationAdapter;
	storageAdapter: IStorageAdapter;
	webPlayerAdapter: IWebPlayerAdapter;
}
