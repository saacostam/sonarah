export type IAnalyticsEvent =
	| { name: "request-access-token"; payload: { success: boolean } }
	| { name: "click-login-button"; payload: { location: "navbar" | "landing" } };

export interface IAnalyticsAdapter {
	trackEvent(event: IAnalyticsEvent): void;
}
