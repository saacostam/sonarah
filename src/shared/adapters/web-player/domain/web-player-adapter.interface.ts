import type { DomainError } from "@/shared/adapters/errors/domain";

export interface IWebPlayerState {
	playback: {
		duration: number;
		position: number;
		paused: boolean;
	};
	track: {
		name: string;
		artists: string[];
		img?: string;
	};
}

export interface IWebPlayerAdapter {
	status:
		| {
				type: "pending";
		  }
		| {
				type: "running";
				payload: {
					deviceId: string;
					state: IWebPlayerState | null;
				};
		  }
		| {
				type: "failed";
				payload: {
					error: DomainError;
					retry: () => void;
				};
		  };
	actions: {
		pause?: () => Promise<void>;
		resume?: () => Promise<void>;
		seek?: (ms: number) => Promise<void>;
	};
	on: (event: "state-changed", cb: (state: IWebPlayerState) => void) => void;
}
