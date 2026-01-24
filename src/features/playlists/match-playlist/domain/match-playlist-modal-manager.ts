export interface IMatchPlaylistModalManager {
	status:
		| {
				type: "browse";
		  }
		| {
				type: "create-playlist";
				uris: string[];
		  };
	setStatus: (status: IMatchPlaylistModalManager["status"]) => void;
}
