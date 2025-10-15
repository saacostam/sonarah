import type { RouteName } from "../entities";

export type GenerateRouteAction =
	| {
			name: RouteName.DASHBOARD;
	  }
	| {
			name: RouteName.HOME;
	  };

export interface IRouterAdapter {
	generateRoute(action: GenerateRouteAction): string;
	getBaseUrl(): string;
	getPathname(): string;
	getUrlSearchParams(): URLSearchParams;
	push(route: string): Promise<void>;
	replace(route: string): Promise<void>;
}
