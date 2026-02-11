import {
	Avatar,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Slider,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	PauseIcon,
	PlayIcon,
} from "@/shared/icons";
import { formatAvatarFallback } from "@/shared/utils";
import { useWebPlayerManager } from "../app";

export function WebPlayer() {
	const wpm = useWebPlayerManager();

	const isPlaybackLoading =
		wpm.status !== "ready" ||
		wpm.pausePlayback.isPending ||
		wpm.startPlayback.isPending ||
		wpm.seekToPosition.isPending;

	const [open, setOpen] = useState(true);

	const [time, setTime] = useState(0);
	const debouncedSeekToPosition = useDebouncedCallback((time: number) => {
		if (wpm.status !== "ready") return;

		const rangedTime = Math.max(0, Math.min(time, 100));
		const normalizedTime = rangedTime / 100;

		wpm.seekToPosition.onClick({
			positionMs: normalizedTime * wpm.state.playback.duration,
		});
	}, 200);

	useEffect(() => {
		if (wpm.status === "ready" && !wpm.state.playback.paused) {
			setTime(wpm.state.playback.position);
		}
	}, [wpm]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (wpm.status === "ready" && !wpm.state.playback.paused) {
				setTime((time) => time + 1000);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [wpm]);

	if (wpm.status === "failed" || wpm.status === "loading") return null;

	return (
		<Flex
			direction="column"
			style={{
				position: "fixed",
				bottom: 0,
				left: 0,
				width: open ? "24rem" : "fit-content",
				maxWidth: "24rem",
				minWidth: "24rem",
				zIndex: 50,
			}}
			align="center"
		>
			<Button
				onClick={() => setOpen((open) => !open)}
				type="button"
				size="1"
				style={{ width: "30%" }}
			>
				{open ? (
					<ChevronDownIcon height={12} width={12} />
				) : (
					<ChevronUpIcon height={12} width={12} />
				)}
			</Button>
			{open && (
				<Card size="2" style={{ width: "100%" }}>
					{wpm.status === "ready" && (
						<Flex direction="row" gap="4" align="center">
							<Box style={{ position: "relative", display: "inline-block" }}>
								<Avatar
									src={wpm.state.track.img}
									fallback={formatAvatarFallback(wpm.state.track.name, "-")}
									size="3"
								/>
								{isPlaybackLoading && (
									<Flex
										style={{
											position: "absolute",
											inset: 0,
											backgroundColor: "black",
											borderRadius: "0.5rem",
											opacity: 0.5,
											zIndex: 1,
										}}
										align="center"
										justify="center"
									>
										<Spinner size="3" />
									</Flex>
								)}
							</Box>
							<Box style={{ flex: 1, minWidth: 0 }}>
								<Heading size="3" truncate>
									{wpm.state.track.name}
								</Heading>
								<Text size="1" truncate color="indigo">
									{wpm.state.track.artists.join(", ")}
								</Text>
								<Flex direction="row" gap="2" mt="1" justify="center">
									{wpm.state.playback.paused && (
										<Button
											onClick={() => wpm.startPlayback.onClick()}
											size="1"
										>
											<PlayIcon height={16} width={16} />
										</Button>
									)}
									{!wpm.state.playback.paused && (
										<Button
											onClick={() => wpm.pausePlayback.onClick()}
											size="1"
										>
											<PauseIcon height={16} width={16} />
										</Button>
									)}
									<Slider
										mt="2"
										size="3"
										value={[
											Math.max(
												0,
												Math.min(time / wpm.state.playback.duration, 1),
											) * 100,
										]}
										onValueChange={([time]) => {
											if (wpm.status !== "ready") return;

											debouncedSeekToPosition(time);
											setTime(
												Math.floor((time / 100) * wpm.state.playback.duration),
											);
										}}
									/>
								</Flex>
							</Box>
						</Flex>
					)}
					{wpm.status === "playback-not-available" && (
						<Button
							style={{ width: "100%" }}
							onClick={wpm.openTransferPlaybackModal}
						>
							Transfer Playback
						</Button>
					)}
				</Card>
			)}
		</Flex>
	);
}
