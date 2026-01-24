import type { ILeanPlaylist } from "../../domain";

export const MockLeanPlaylistFactory = (n: number): ILeanPlaylist[] => {
	return Array.from({ length: n }, (_, i) => ({
		id: `${i + 1}`,
		name: `Playlist ${i + 1}`,
		creator: {
			id: `Creator Id ${i + 1}`,
			name: `Creator Name ${i + 1}`,
		},
		numberOfTracks: (i + 1) * 3,
		pictureUrl: `https://picture-url/${i + 1}`,
	}));
};
