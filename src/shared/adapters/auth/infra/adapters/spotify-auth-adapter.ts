import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import {
	type IStorageAdapter,
	StorageKeys,
} from "@/shared/adapters/storage/domain";
import type { IAuthAdapter, IAuthAdapterPayload, ISession } from "../../domain";

const CLIENT_ID = "336489bc89354dff841b0eb68d389193";

export class SpotifyAuthAdapter implements IAuthAdapter {
	constructor(
		private clientStorageAdapter: IStorageAdapter,
		private routerAdapter: IRouterAdapter,
	) {}

	async getToken(): Promise<ISession> {
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

	async removeToken() {
		await this.clientStorageAdapter.remove(StorageKeys.TOKEN);
	}

	async setToken({ token }: IAuthAdapterPayload["ISetTokenIn"]) {
		await this.clientStorageAdapter.set(StorageKeys.TOKEN, token);
	}

	async startAuthFlow() {
		const redirectUri = this.getRedirectUri();

		const scope =
			"user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private streaming user-read-playback-state user-modify-playback-state";
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

	private async sha256(plain: string) {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return window.crypto.subtle.digest("SHA-256", data);
	}

	private getRedirectUri() {
		return this.routerAdapter.getBaseUrl();
	}
}
