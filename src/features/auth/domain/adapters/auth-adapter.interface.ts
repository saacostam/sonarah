import type { ISession } from "../entities";

export interface IAuthAdapter {
	getSession: () => Promise<ISession>;
	removeSession: () => Promise<void>;
	requestAccessToken: (
		args: IAuthAdapterPayload["IRequestAccessTokenIn"],
	) => Promise<IAuthAdapterPayload["IRequestAccessTokenOut"]>;
	setSession: (args: IAuthAdapterPayload["ISetSessionIn"]) => Promise<void>;
	startAuthFlow: () => Promise<void>;
}

export interface IAuthAdapterPayload {
	IRequestAccessTokenIn: {
		code: string;
	};
	IRequestAccessTokenOut: string;
	ISetSessionIn: {
		token: string;
	};
}
