export enum QueryKey {
	INIT_WEB_PLAYER = "Init Web Player",
	MY_PLAYLISTS = "My Playlists",
	PLAYBACK_STATE = "Playback State",
	PLAYLIST_BY_ID = "Playlist By Id",
	SEARCH_PLAYLISTS = "Search Playlists",
	SESSION = "Session",
	TRACK_RECOMMENDATIONS = "Track Recommendations",
	USER = "User",
}

export enum MutationKey {
	ADD_ITEM_TO_PLAYLIST = "Add Item To Playlist",
	CREATE_PLAYLIST = "Create Playlist",
	LOGOUT = "Logout",
	PAUSE_PLAYBACK = "Pause Playback",
	PLAY_TRACK_OF_PLAYLIST = "Play Track Of Playlist",
	REQUEST_ACCESS_TOKEN = "Request Access Token",
	SAVE_PLAYLIST = "Save Playlist",
	SEEK_TO_POSITION = "Seek To Position",
	SET_SESSION = "Set Session",
	START_AUTH_FLOW = "Start Auth Flow",
	START_PLAYBACK = "Start Playback",
	UNFOLLOW_PLAYLIST = "Unfollow Playlist",
}
