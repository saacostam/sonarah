export interface IManagePlaylistModalManager {
	status:
		| {
				type: "browse";
		  }
		| {
				type: "search-track";
				playlistId: string;
		  };
	setStatus: (status: IManagePlaylistModalManager["status"]) => void;
}
