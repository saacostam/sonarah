import type { IClientAdapter, IClientAdapterRequestConfig } from "../../domain";

export class FetchClientAdapter implements IClientAdapter {
	private readonly baseUrl?: string;
	private readonly defaultHeaders?: Record<string, string>;

	constructor(options?: {
		baseUrl?: string;
		defaultHeaders?: Record<string, string>;
	}) {
		this.baseUrl = options?.baseUrl;
		this.defaultHeaders = options?.defaultHeaders;
	}

	private buildUrl(
		url: string,
		params?: Record<string, string | number | boolean>,
	): string {
		const fullUrl = this.baseUrl ? `${this.baseUrl}${url}` : url;
		if (!params) return fullUrl;

		const queryString = new URLSearchParams(
			Object.entries(params).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value);
					return acc;
				},
				{} as Record<string, string>,
			),
		).toString();

		return queryString ? `${fullUrl}?${queryString}` : fullUrl;
	}

	private buildHeaders(config?: IClientAdapterRequestConfig): HeadersInit {
		return {
			"Content-Type": "application/json",
			...this.defaultHeaders,
			...config?.headers,
		};
	}

	private async request<TResponse>(
		method: string,
		url: string,
		body?: unknown,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		const response = await fetch(this.buildUrl(url, config?.params), {
			method,
			headers: this.buildHeaders(config),
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			const errorBody = await response.text().catch(() => "");
			throw new Error(
				`HTTP ${response.status} ${response.statusText}: ${errorBody}`,
			);
		}

		return response.json() as Promise<TResponse>;
	}

	get<TResponse>(
		url: string,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		return this.request<TResponse>("GET", url, undefined, config);
	}

	post<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		return this.request<TResponse>("POST", url, body, config);
	}

	put<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		return this.request<TResponse>("PUT", url, body, config);
	}

	patch<TResponse, TBody = unknown>(
		url: string,
		body?: TBody,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		return this.request<TResponse>("PATCH", url, body, config);
	}

	delete<TResponse>(
		url: string,
		config?: IClientAdapterRequestConfig,
	): Promise<TResponse> {
		return this.request<TResponse>("DELETE", url, undefined, config);
	}
}
