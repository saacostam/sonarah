export type IWebPlayerAdapter =
	| {
			init(): void;
			isReady: true;
			play(args: IWebPlayerAdapterPayload["PlayIn"]): void;
			pause(): void;
	  }
	| {
			isReady: false;
			init(): void;
	  };

export interface IWebPlayerAdapterPayload {
	PlayIn: {
		trackId: string;
	};
}
