import {
	Avatar,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Slider,
	Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	ArrowPathIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	PauseIcon,
	PlayIcon,
} from "@/shared/icons";
import { useRepositories } from "@/shared/repositories/app";

export function WebPlayer() {
	const { webPlayer } = useRepositories();

	const [open, setOpen] = useState(true);

	const [time, setTime] = useState(0);
	const debouncedSeekToPosition = useDebouncedCallback((time: number) => {
		if (webPlayer.status.type !== "ready" || !webPlayer.state) return;

		const rangedTime = Math.max(0, Math.min(time, 100));
		const normalizedTime = rangedTime / 100;

		webPlayer.seekToPosition({
			deviceId: webPlayer.status.deviceId,
			positionMs: normalizedTime * webPlayer.state.duration,
		});
	}, 200);

	useEffect(() => {
		if (webPlayer.state?.position) {
			setTime(webPlayer.state.position);
		}
	}, [webPlayer.state?.position]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (webPlayer.playback === "playing") {
				setTime((time) => time + 1000);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [webPlayer.playback]);

	const { pausePlayback, status } = webPlayer;
	useEffect(() => {
		return () => {
			if (status.type === "ready") {
				pausePlayback();
			}
		};
	}, [pausePlayback, status.type]);

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
					{webPlayer.status.type !== "ready" && (
						<Button
							onClick={webPlayer.init}
							loading={webPlayer.status.type === "loading"}
						>
							<ArrowPathIcon /> Reload
						</Button>
					)}
					{webPlayer.status.type === "ready" && (
						<Flex direction="row" gap="4" align="center">
							<Avatar
								src={webPlayer.track?.img}
								fallback={webPlayer.track?.name || "?"}
								size="3"
							/>
							<Box style={{ flex: 1, minWidth: 0 }}>
								<Heading size="3" truncate>
									{webPlayer.track?.name}
								</Heading>
								<Text size="1" truncate color="indigo">
									{webPlayer.track?.artists.join(", ")}
								</Text>
								{webPlayer.state !== null && (
									<Flex direction="row" gap="2" mt="1" justify="center">
										{webPlayer.playback === "paused" && (
											<Button
												onClick={() => webPlayer.startPlayback()}
												size="1"
											>
												<PlayIcon height={16} width={16} />
											</Button>
										)}
										{webPlayer.playback === "playing" && (
											<Button
												onClick={() => webPlayer.pausePlayback()}
												size="1"
											>
												<PauseIcon height={16} width={16} />
											</Button>
										)}
										<Slider
											mt="2"
											size="1"
											value={[
												Math.max(
													0,
													Math.min(time / webPlayer.state.duration, 1),
												) * 100,
											]}
											radius="none"
											onValueChange={([time]) => {
												debouncedSeekToPosition(time);
												setTime(
													Math.floor(
														(time / 100) * (webPlayer.state?.duration || 0),
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
