import { useCallback, useMemo } from "react";
import type { IAnalyticsAdapter } from "../../domain";

const BASE_URL = "https://saacostam-api.onrender.com";

export interface IPostEventRequest {
	name: string;
	payload: string;
}

const trackEventUrl = new URL("/analytics/event", BASE_URL);

export function useAnalyticsAdapter(): IAnalyticsAdapter {
	const trackEvent: IAnalyticsAdapter["trackEvent"] = useCallback((event) => {
		try {
			const request: IPostEventRequest = {
				name: event.name,
				payload: JSON.stringify(event.payload ?? null),
			};

			void fetch(trackEventUrl.toString(), {
				method: "POST",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch {
			// do nothing - not business critical
		}
	}, []);

	return useMemo(
		() => ({
			trackEvent,
		}),
		[trackEvent],
	);
}
