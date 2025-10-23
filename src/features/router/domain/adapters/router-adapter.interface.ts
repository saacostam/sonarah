import type { RouteName } from "../entities";

export type GenerateRouteAction =
	| {
			name: RouteName.DASHBOARD;
	  }
	| {
			name: RouteName.HOME;
	  }
	| {
			name: RouteName.PLAYLIST_BY_ID;
			payload: {
				id: string;
			};
	  }
	| {
			name: RouteName.MATCH_PLAYLIST_BY_ID;
			payload: {
				id: string;
			};
	  };

export interface IRouterAdapter {
	defineRoute(name: RouteName): string;
	generateRoute(action: GenerateRouteAction): string;
	getBaseUrl(): string;
	getPathname(): string;
	getParams(): Record<string, string | undefined>;
	getUrlSearchParams(): URLSearchParams;
	push(route: string): Promise<void>;
	replace(route: string): Promise<void>;
	reset(): Promise<void>;
}
