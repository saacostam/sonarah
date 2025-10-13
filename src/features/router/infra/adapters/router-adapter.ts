import {
	type GenerateRouteAction,
	type IRouterAdapter,
	RouteName,
} from "../../domain";

export class RouterAdapter implements IRouterAdapter {
	generateRoute(action: GenerateRouteAction): string {
		switch (action.name) {
			case RouteName.LOGIN: {
				return "/login";
			}
		}
	}
}
