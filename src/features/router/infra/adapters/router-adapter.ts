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
			case RouteName.DASHBOARD: {
				return "/app";
			}
			case RouteName.HOME: {
				return "/";
			}
		}
	}

	getBaseUrl(): string {
		return window.location.origin;
	}

	getPathname(): string {
		return this.location.pathname;
	}

	getUrlSearchParams(): URLSearchParams {
		return new URLSearchParams(window.location.search);
	}

	async push(route: string): Promise<void> {
		return this.navigate(route);
	}

	async replace(route: string): Promise<void> {
		return this.navigate(route, { replace: true });
	}
}
