import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatTimeFromMilliseconds } from "@/shared/utils";
import type { ITrack } from "../domain";
import { MockPlaylistFactory } from "../test";
import { PlaylistBrief } from "./playlist-brief";

describe("PlaylistBrief", () => {
	const [playlist] = MockPlaylistFactory(1, [
		{ id: "t1", durationInMs: 60_000 } as ITrack,
		{ id: "t2", durationInMs: 120_000 } as ITrack,
		{ id: "t3", durationInMs: 30_000 } as ITrack,
	]);

	it("renders playlist metadata", () => {
		render(<PlaylistBrief playlist={playlist} />);

		expect(screen.getByText(playlist.name)).toBeInTheDocument();
		expect(screen.getByText(`by ${playlist.creator.name}`)).toBeInTheDocument();
	});

	it("renders track count and total duration derived from playlist", () => {
		render(<PlaylistBrief playlist={playlist} />);

		const totalDurationMs = playlist.tracks.reduce(
			(sum, track) => sum + track.durationInMs,
			0,
		);

		const formattedDuration = formatTimeFromMilliseconds(totalDurationMs);

		expect(
			screen.getByText(
				`${playlist.numberOfTracks} songs • ${formattedDuration}`,
			),
		).toBeInTheDocument();
	});
});
