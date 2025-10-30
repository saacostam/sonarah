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
		  };
	setStatus: (status: IDashboardModalManager["status"]) => void;
}
