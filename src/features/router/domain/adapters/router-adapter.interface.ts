import type { RouteName } from "../entities";

export type GenerateRouteAction =
	| {
			name: RouteName.DASHBOARD;
	  }
	| {
			name: RouteName.LOGIN;
	  }
	| {
			name: RouteName.HOME;
	  };

export interface IRouterAdapter {
	generateRoute(action: GenerateRouteAction): string;
	push(route: string): Promise<void>;
	getLocation(): string;
	getBaseUrl(): string;
}
