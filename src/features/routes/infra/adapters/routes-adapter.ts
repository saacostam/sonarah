import {
	type GenerateRouteAction,
	type IRoutesAdapter,
	RouteName,
} from "../../domain";

export class RoutesAdapter implements IRoutesAdapter {
	defineRoute(name: RouteName): string {
		switch (name) {
			case RouteName.DASHBOARD: {
				return "/app";
			}
			case RouteName.HOME: {
				return "/";
			}
			case RouteName.MATCH_PLAYLIST_BY_ID: {
				return "/match/:id";
			}
			case RouteName.PLAYLIST_BY_ID: {
				return "/playlist/:id";
			}
		}
	}

	generateRoute(action: GenerateRouteAction): string {
		switch (action.name) {
			case RouteName.DASHBOARD: {
				return "/app";
			}
			case RouteName.HOME: {
				return "/";
			}
			case RouteName.MATCH_PLAYLIST_BY_ID: {
				return `/match/${action.payload.id}`;
			}
			case RouteName.PLAYLIST_BY_ID: {
				return `/playlist/${action.payload.id}`;
			}
		}
	}
}
