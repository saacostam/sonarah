import type { useLocation, useNavigate } from "react-router";
import {
	type GenerateRouteAction,
	type IRouterAdapter,
	RouteName,
} from "../../domain";

export class RouterAdapter implements IRouterAdapter {
	constructor(
		private navigate: ReturnType<typeof useNavigate>,
		private location: ReturnType<typeof useLocation>,
	) {}

	generateRoute(action: GenerateRouteAction): string {
		switch (action.name) {
			case RouteName.LOGIN: {
				return "/login";
			}
			case RouteName.HOME: {
				return "/";
			}
		}
	}

	async push(route: string): Promise<void> {
		return this.navigate(route);
	}

	getLocation(): string {
		return this.location.pathname;
	}
}
