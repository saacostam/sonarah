import type { IAuthAdapter } from "@/shared/adapters/auth/domain";
import type { IErrorLoggerAdapter } from "@/shared/adapters/errors/domain";
import type { IIntersectionObserverAdapter } from "@/shared/adapters/intersection-observer/domain";
import type { INavigationAdapter } from "@/shared/adapters/navigation/domain";
import type { INotificationAdapter } from "@/shared/adapters/notifications/domain";
import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import type { IStorageAdapter } from "@/shared/adapters/storage/domain";
import type { IThemeAdapter } from "@/shared/adapters/theme/domain";
import type { IWebPlayerAdapter } from "@/shared/adapters/web-player/domain";

export interface IAdapters {
	authAdapter: IAuthAdapter;
	errorLoggerAdapter: IErrorLoggerAdapter;
	intersectionObserverAdapter: IIntersectionObserverAdapter;
	notificationsAdapter: INotificationAdapter;
	routerAdapter: IRouterAdapter;
	navigationAdapter: INavigationAdapter;
	storageAdapter: IStorageAdapter;
	themeAdapter: IThemeAdapter;
	webPlayerAdapter: IWebPlayerAdapter;
}
