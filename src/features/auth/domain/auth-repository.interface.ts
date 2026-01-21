export interface IAuthRepository {
	requestAccessToken: (
		args: IAuthRepositoryPayload["IRequestAccessTokenIn"],
	) => Promise<IAuthRepositoryPayload["IRequestAccessTokenOut"]>;
}

export interface IAuthRepositoryPayload {
	IRequestAccessTokenIn: {
		code: string;
	};
	IRequestAccessTokenOut: string;
}
