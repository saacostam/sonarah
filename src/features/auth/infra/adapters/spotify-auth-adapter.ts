import { DomainError, DomainErrorType } from "@/features/errors/domain";
import type { IRouterAdapter } from "@/features/router/domain";
import { type IStorageAdapter, StorageKeys } from "@/features/storage/domain";
import type { IAuthAdapter, IAuthAdapterPayload, ISession } from "../../domain";

const CLIENT_ID = "336489bc89354dff841b0eb68d389193";

export class SpotifyAuthAdapter implements IAuthAdapter {
	private inFlightRequests = new Map<string, Promise<string>>();

	constructor(
		private clientStorageAdapter: IStorageAdapter,
		private routerAdapter: IRouterAdapter,
	) {}

	async getSession(): Promise<ISession> {
		const _token = await this.clientStorageAdapter.get(StorageKeys.TOKEN);

		const token =
			typeof _token === "string" && _token.trim().length > 0 ? _token : null;

		return token
			? {
					type: "authenticated",
					token,
				}
			: {
					type: "unauthenticated",
				};
	}

	async removeSession() {
		await this.clientStorageAdapter.remove(StorageKeys.TOKEN);
	}

	async requestAccessToken(args: IAuthAdapterPayload["IRequestAccessTokenIn"]) {
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
		args: IAuthAdapterPayload["IRequestAccessTokenIn"],
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

	async setSession({ token }: IAuthAdapterPayload["ISetSessionIn"]) {
		await this.clientStorageAdapter.set(StorageKeys.TOKEN, token);
	}

	async startAuthFlow() {
		const redirectUri = this.getRedirectUri();

		const scope = "user-read-private user-read-email";
		const authUrl = new URL("https://accounts.spotify.com/authorize");

		const { codeChallenge, codeVerifier } = await this.getCodeChallenge();

		this.clientStorageAdapter.set(StorageKeys.CODE_VERIFIER, codeVerifier);

		const params = {
			response_type: "code",
			client_id: CLIENT_ID,
			scope,
			code_challenge_method: "S256",
			code_challenge: codeChallenge,
			redirect_uri: redirectUri,
		};

		authUrl.search = new URLSearchParams(params).toString();
		window.location.href = authUrl.toString();
	}

	private base64encode(input: ArrayBuffer) {
		return btoa(String.fromCharCode(...new Uint8Array(input)))
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");
	}

	private generateRandomString(length: number) {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], "");
	}

	private async getCodeChallenge() {
		const codeVerifier = this.generateRandomString(64);
		const hashed = await this.sha256(codeVerifier);
		return {
			codeVerifier,
			codeChallenge: this.base64encode(hashed),
		};
	}

	private getRedirectUri() {
		return this.routerAdapter.getBaseUrl();
	}

	private async sha256(plain: string) {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return window.crypto.subtle.digest("SHA-256", data);
	}
}
