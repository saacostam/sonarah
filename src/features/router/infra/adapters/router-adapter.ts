import { type useLocation, type useNavigate, useParams } from "react-router";
import type { IRouterAdapter } from "../../domain";

export class RouterAdapter implements IRouterAdapter {
	constructor(
		private navigate: ReturnType<typeof useNavigate>,
		private location: ReturnType<typeof useLocation>,
	) {}

	getBaseUrl(): string {
		return window.location.origin;
	}

	getPathname(): string {
		return this.location.pathname;
	}

	getParams(): Record<string, string | undefined> {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return useParams();
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

	async reset(): Promise<void> {
		window.location.href = window.location.origin;
	}
}
