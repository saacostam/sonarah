export interface ILeanPlaylist {
	id: string;
	name: string;
	pictureUrl?: string;
	creatorName: string;
	numberOfTracks: number;
}

export interface IPlaylist extends ILeanPlaylist {
	tracks: ITrack[];
}

export interface ITrack {
	id: string;
	name: string;
	pictureUrl?: string;
	artistNames: string[];
}
