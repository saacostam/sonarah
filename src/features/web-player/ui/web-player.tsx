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
import { useAdapters } from "@/shared/adapters/core/app";
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
} from "../app";

export function WebPlayer() {
	const { webPlayerAdapter } = useAdapters();

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
		if (webPlayerAdapter.status.type !== "running") return;

		const rangedTime = Math.max(0, Math.min(time, 100));
		const normalizedTime = rangedTime / 100;

		seekToPosition.mutate({
			deviceId: webPlayerAdapter.status.payload.deviceId,
			positionMs:
				normalizedTime *
				webPlayerAdapter.status.payload.state.playback.duration,
		});
	}, 200);

	useEffect(() => {
		if (
			webPlayerAdapter.status.type === "running" &&
			!webPlayerAdapter.status.payload.state.playback.paused
		) {
			setTime(webPlayerAdapter.status.payload.state.playback.position);
		}
	}, [webPlayerAdapter.status]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (
				webPlayerAdapter.status.type === "running" &&
				!webPlayerAdapter.status.payload.state.playback.paused
			) {
				setTime((time) => time + 1000);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [webPlayerAdapter.status]);

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
					{webPlayerAdapter.status.type === "running" && (
						<Flex direction="row" gap="4" align="center">
							<Box style={{ position: "relative", display: "inline-block" }}>
								<Avatar
									src={webPlayerAdapter.status.payload.state.track.img}
									fallback={
										webPlayerAdapter.status.payload.state.track.name || "?"
									}
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
									{webPlayerAdapter.status.payload.state.track.name}
								</Heading>
								<Text size="1" truncate color="indigo">
									{webPlayerAdapter.status.payload.state.track.artists.join(
										", ",
									)}
								</Text>
								<Flex direction="row" gap="2" mt="1" justify="center">
									{webPlayerAdapter.status.payload.state.playback.paused && (
										<Button onClick={() => startPlayback.mutate()} size="1">
											<PlayIcon height={16} width={16} />
										</Button>
									)}
									{!webPlayerAdapter.status.payload.state.playback.paused && (
										<Button onClick={() => pausePlayback.mutate()} size="1">
											<PauseIcon height={16} width={16} />
										</Button>
									)}
									<Slider
										mt="2"
										size="3"
										value={[
											Math.max(
												0,
												Math.min(
													time /
														webPlayerAdapter.status.payload.state.playback
															.duration,
													1,
												),
											) * 100,
										]}
										onValueChange={([time]) => {
											if (webPlayerAdapter.status.type !== "running") return;

											debouncedSeekToPosition(time);
											setTime(
												Math.floor(
													(time / 100) *
														webPlayerAdapter.status.payload.state.playback
															.duration,
												),
											);
										}}
									/>
								</Flex>
							</Box>
						</Flex>
					)}
				</Card>
			)}
		</Flex>
	);
}
