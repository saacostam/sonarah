import type { ISession } from "../entities";

export interface IAuthAdapter {
	getToken: () => ISession;
	removeToken: () => void;
	setToken: (args: IAuthAdapterPayload["ISetTokenIn"]) => void;
	startAuthFlow: () => Promise<void>;
}

export interface IAuthAdapterPayload {
	ISetTokenIn: {
		token: string;
	};
}
