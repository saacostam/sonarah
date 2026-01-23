import type { IWebPlayerState } from "@/shared/adapters/web-player/domain";
import type { IWebPlayerRepositoryPayload } from "./web-player-repository.interface";

type TrackedPromise<Args> = {
	onClick: (args: Args) => void;
	isPending: boolean;
};

type Mutations = {
	startPlayback: TrackedPromise<void>;
	pausePlayback: TrackedPromise<void>;
	seekToPosition: TrackedPromise<{
		positionMs: number;
	}>;
	playTrackOfPlaylist: TrackedPromise<
		IWebPlayerRepositoryPayload["PlayTrackOfPlaylistIn"]
	>;
};

export type IWebPlayerManager =
	| {
			status: "failed" | "loading";
	  }
	| ({
			status: "playback-not-available";
			openTransferPlaybackModal: () => void;
	  } & Mutations)
	| ({
			status: "ready";
			state: IWebPlayerState;
	  } & Mutations);
