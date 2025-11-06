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

export interface IRoutesAdapter {
	defineRoute(name: RouteName): string;
	generateRoute(action: GenerateRouteAction): string;
}
