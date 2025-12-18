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
import {
	useMutationPausePlayback,
	useMutationSeekToPosition,
	useMutationStartPlayback,
	useWebPlayer,
} from "../app";

export function WebPlayer() {
	const webPlayer = useWebPlayer();

	const startPlayback = useMutationStartPlayback();
	const pausePlayback = useMutationPausePlayback();
	const seekToPosition = useMutationSeekToPosition();

	const isPlaybackLoading =
		pausePlayback.isPending ||
		startPlayback.isPending ||
		seekToPosition.isPending;

	const [open, setOpen] = useState(true);

	const [time, setTime] = useState(0);
	const debouncedSeekToPosition = useDebouncedCallback((time: number) => {
		if (webPlayer.type !== "ready:playing" && webPlayer.type !== "ready:paused")
			return;

		const rangedTime = Math.max(0, Math.min(time, 100));
		const normalizedTime = rangedTime / 100;

		seekToPosition.mutate({
			deviceId: webPlayer.deviceId,
			positionMs: normalizedTime * webPlayer.state.playback.duration,
		});
	}, 200);

	useEffect(() => {
		if (webPlayer.type === "ready:playing") {
			setTime(webPlayer.state.playback.position ?? 0);
		}
	}, [webPlayer]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (webPlayer.type === "ready:playing") {
				setTime((time) => time + 1000);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [webPlayer]);

	return (
		<Flex
			direction="column"
			style={{
				position: "fixed",
				bottom: 0,
				right: 0,
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
					{(webPlayer.type === "ready:paused" ||
						webPlayer.type === "ready:playing") && (
						<Flex direction="row" gap="4" align="center">
							<Box style={{ position: "relative", display: "inline-block" }}>
								<Avatar
									src={webPlayer.state.track.img}
									fallback={webPlayer.state.track.name || "?"}
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
									{webPlayer.state.track.name}
								</Heading>
								<Text size="1" truncate color="indigo">
									{webPlayer.state.track.artists.join(", ")}
								</Text>
								{webPlayer.state.playback !== null && (
									<Flex direction="row" gap="2" mt="1" justify="center">
										{webPlayer.state.playback.paused && (
											<Button onClick={() => startPlayback.mutate()} size="1">
												<PlayIcon height={16} width={16} />
											</Button>
										)}
										{webPlayer.state.playback &&
											!webPlayer.state.playback.paused && (
												<Button onClick={() => pausePlayback.mutate()} size="1">
													<PauseIcon height={16} width={16} />
												</Button>
											)}
										<Slider
											mt="2"
											size="2"
											value={[
												Math.max(
													0,
													Math.min(time / webPlayer.state.playback.duration, 1),
												) * 100,
											]}
											radius="none"
											onValueChange={([time]) => {
												debouncedSeekToPosition(time);
												setTime(
													Math.floor(
														(time / 100) *
															(webPlayer.state.playback.duration || 0),
													),
												);
											}}
										/>
									</Flex>
								)}
							</Box>
						</Flex>
					)}
				</Card>
			)}
		</Flex>
	);
}
