import type { ISession } from "../entities";

export interface IAuthAdapter {
	getToken: () => Promise<ISession>;
	removeToken: () => Promise<void>;
	setToken: (args: IAuthAdapterPayload["ISetTokenIn"]) => Promise<void>;
	startAuthFlow: () => Promise<void>;
}

export interface IAuthAdapterPayload {
	ISetTokenIn: {
		token: string;
	};
}
