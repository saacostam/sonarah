import type { ISession } from "../entities";

export interface IAuthAdapter {
	getToken: () => Promise<ISession>;
	removeToken: () => Promise<void>;
	requestAccessToken: (
		args: IAuthAdapterPayload["IRequestAccessTokenIn"],
	) => Promise<IAuthAdapterPayload["IRequestAccessTokenOut"]>;
	setToken: (args: IAuthAdapterPayload["ISetTokenIn"]) => Promise<void>;
	startAuthFlow: () => Promise<void>;
}

export interface IAuthAdapterPayload {
	IRequestAccessTokenIn: {
		code: string;
	};
	IRequestAccessTokenOut: string;
	ISetTokenIn: {
		token: string;
	};
}
