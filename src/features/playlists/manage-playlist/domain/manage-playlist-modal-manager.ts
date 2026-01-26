export interface IManagePlaylistModalManager {
	status:
		| {
				type: "browse";
		  }
		| {
				type: "search-track";
				playlistId: string;
		  }
		| {
				type: "delete-track";
				playlistId: string;
				trackUri: string;
		  };
	setStatus: (status: IManagePlaylistModalManager["status"]) => void;
}
