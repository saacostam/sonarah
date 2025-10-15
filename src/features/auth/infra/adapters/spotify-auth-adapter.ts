import { type IRouterAdapter, RouteName } from "@/features/router/domain";
import { type IStorageAdapter, StorageKeys } from "@/features/storage/domain";
import type { IAuthAdapter, ISession } from "../../domain";

const CLIENT_ID = "336489bc89354dff841b0eb68d389193";

export class SpotifyAuthAdapter implements IAuthAdapter {
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

	async startAuthFlow() {
		const redirectUri = `${this.routerAdapter.getBaseUrl()}/#${this.routerAdapter.generateRoute({ name: RouteName.LOGIN })}`;

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

	private generateRandomString(length: number) {
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], "");
	}

	private async sha256(plain: string) {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return window.crypto.subtle.digest("SHA-256", data);
	}

	private base64encode(input: ArrayBuffer) {
		return btoa(String.fromCharCode(...new Uint8Array(input)))
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");
	}

	private async getCodeChallenge() {
		const codeVerifier = this.generateRandomString(64);
		const hashed = await this.sha256(codeVerifier);
		return {
			codeVerifier,
			codeChallenge: this.base64encode(hashed),
		};
	}
}
