import type { IAuthAdapter } from "@/shared/adapters/auth/domain";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import {
	type INavigationAdapter,
	RouteName,
} from "@/shared/adapters/navigation/domain";
import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import type { IClientAdapter, IClientAdapterRequestConfig } from "../../domain";

export class FetchClientAdapter implements IClientAdapter {
	private readonly baseUrl?: string;
	private readonly defaultHeaders?: Record<string, string>;

	constructor(
		private authAdapter: IAuthAdapter,
		private routerAdapter: IRouterAdapter,
		private navigationAdapter: INavigationAdapter,
		options?: {
			baseUrl?: string;
			defaultHeaders?: Record<string, string>;
		},
	) {
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
			if (response.status === 401) {
				await this.authAdapter.removeToken();
				await this.routerAdapter.push(
					this.navigationAdapter.generateRoute({ name: RouteName.HOME }),
				);
			}

			const errorBody = await response.text().catch(() => "");

			if (response.status === 404) {
				throw new DomainError(
					DomainErrorType.NOT_FOUND,
					"Not found",
					`[FetchClientAdapter.404]: ${errorBody}`,
				);
			}

			throw new Error(
				`HTTP ${response.status} ${response.statusText}: ${errorBody}`,
			);
		}

		if (response.status === 204) {
			return {} as TResponse;
		}

		const text = await response.text();
		if (!text) {
			return {} as TResponse;
		}

		try {
			return JSON.parse(text) as TResponse;
		} catch {
			// Handle invalid JSON but non-empty body gracefully
			throw new Error(`Invalid JSON response: ${text}`);
		}
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
