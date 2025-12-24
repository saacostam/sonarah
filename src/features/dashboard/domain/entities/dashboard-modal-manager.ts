export interface IDashboardModalManager {
	status:
		| {
				type: "browse";
		  }
		| {
				type: "create-playlist";
		  }
		| {
				type: "search-playlist";
		  }
		| {
				type: "unfollow-playlist";
				payload: {
					id: string;
				};
		  };
	setStatus: (status: IDashboardModalManager["status"]) => void;
}
