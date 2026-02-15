import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import {
	type IStorageAdapter,
	StorageKeys,
} from "@/shared/adapters/storage/domain";
import type { IAuthClient, IAuthClientPayload } from "../domain";

const CLIENT_ID = "336489bc89354dff841b0eb68d389193";

export class SpotifyAuthClient implements IAuthClient {
	constructor(
		private clientStorageAdapter: IStorageAdapter,
		private routerAdapter: IRouterAdapter,
	) {}

	private inFlightRequests = new Map<string, Promise<string>>();

	async requestAccessToken(args: IAuthClientPayload["IRequestAccessTokenIn"]) {
		const { code } = args;

		// If the same code is already being processed, return the same promise
		if (this.inFlightRequests.has(code)) {
			const req = this.inFlightRequests.get(code);
			if (req) return req;
		}

		const requestPromise = this._doRequestAccessToken(args).finally(() => {
			// Clean up after it resolves or rejects
			this.inFlightRequests.delete(code);
		});

		this.inFlightRequests.set(code, requestPromise);
		return requestPromise;
	}

	private async _doRequestAccessToken(
		args: IAuthClientPayload["IRequestAccessTokenIn"],
	) {
		const _codeVerifier = await this.clientStorageAdapter.get(
			StorageKeys.CODE_VERIFIER,
		);
		const codeVerifier =
			typeof _codeVerifier === "string" ? _codeVerifier : null;

		if (!codeVerifier) {
			throw new DomainError(
				DomainErrorType.BAD_REQUEST,
				"We couldn't complete the login process. Please try signing in again.",
				"[PKCE] Missing code_verifier",
			);
		}

		const redirectUri = this.getRedirectUri();
		const url = "https://accounts.spotify.com/api/token";

		const payload = {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				grant_type: "authorization_code",
				code: args.code,
				redirect_uri: redirectUri,
				code_verifier: codeVerifier,
			}),
		};

		const response = await fetch(url, payload);

		if (!response.ok) {
			const errorBody = await response.text();
			throw new DomainError(
				DomainErrorType.BAD_REQUEST,
				"Failed to get access token from Spotify. Please try again.",
				`[SpotifyAuthAdapter] HTTP ${response.status}: ${errorBody}`,
			);
		}

		const body = await response.json();

		if (!body.access_token) {
			throw new DomainError(
				DomainErrorType.BAD_REQUEST,
				"Invalid response received from Spotify. Please try signing in again.",
				"[SpotifyAuthAdapter] Missing access_token in response",
			);
		}

		return body.access_token;
	}

	private getRedirectUri() {
		return this.routerAdapter.getBaseUrl();
	}
}
