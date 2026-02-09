export interface AnalyticsEventMap {
	"request-access-token": { success: boolean };
	"click-login-button": { location: "navbar" | "landing" };
}

export type IAnalyticsEvent = {
	[K in keyof AnalyticsEventMap]: {
		name: K;
		payload: AnalyticsEventMap[K];
	};
}[keyof AnalyticsEventMap];

export interface IAnalyticsAdapter {
	trackEvent(event: IAnalyticsEvent): void;
}
