import type { IWebPlayerState } from "@/features/web-player/domain";
import type { DomainError } from "@/shared/adapters/errors/domain";

export interface IWebPlayerAdapter {
	status:
		| {
				type: "pending";
		  }
		| {
				type: "running";
				payload: {
					deviceId: string;
					state: IWebPlayerState;
				};
		  }
		| {
				type: "failed";
				payload: {
					error: DomainError;
					retry: () => void;
				};
		  };
}
