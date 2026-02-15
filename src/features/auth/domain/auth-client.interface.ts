export interface IAuthClient {
	requestAccessToken: (
		args: IAuthClientPayload["IRequestAccessTokenIn"],
	) => Promise<IAuthClientPayload["IRequestAccessTokenOut"]>;
}

export interface IAuthClientPayload {
	IRequestAccessTokenIn: {
		code: string;
	};
	IRequestAccessTokenOut: string;
}
