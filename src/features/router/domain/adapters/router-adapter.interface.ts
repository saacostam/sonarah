import type { RouteName } from "../entities";

export type GenerateRouteAction = {
	name: RouteName.LOGIN;
};

export interface IRouterAdapter {
	generateRoute(action: GenerateRouteAction): string;
}
