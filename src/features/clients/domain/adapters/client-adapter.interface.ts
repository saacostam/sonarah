export interface IClientAdapter {
	get<TResponse>(
		url: string,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse>;
	post<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse>;
	put<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse>;
	patch<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse>;
	delete<TResponse>(
		url: string,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse>;
}

export interface IClientAdapterRequestConfig {
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean>;
}
