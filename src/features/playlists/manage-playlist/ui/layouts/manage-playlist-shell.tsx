import { Flex, Heading, Tooltip } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { PolymorphicButton } from "@/shared/components";
import { ChevronLeftIcon, PlayIcon } from "@/shared/icons";

export interface ManagePlaylistShellProps {
	onBackHref: string;
	onNextHref: string;
	title: string;
}

export function ManagePlaylistShell({
	children,
	onBackHref,
	onNextHref,
	title,
}: PropsWithChildren<ManagePlaylistShellProps>) {
	return (
		<>
			<Flex direction="column" justify="between" gap="4" mb="4">
				<Flex align="end" direction="row" justify="between" gap="4">
					<PolymorphicButton
						action={{
							action: {
								type: "href",
								href: onBackHref,
							},
							label: (
								<>
									<ChevronLeftIcon width={16} height={16} />
									Back to My Playlists
								</>
							),
						}}
						variant="soft"
					/>
					<Tooltip content="Move on to create your playlist based on this reference.">
						<PolymorphicButton
							action={{
								action: {
									type: "href",
									href: onNextHref,
								},
								label: (
									<>
										<PlayIcon width={16} height={16} />
										Next: Build Your Playlist
									</>
								),
							}}
						/>
					</Tooltip>
				</Flex>
				<Heading>{title}</Heading>
			</Flex>
			{children}
		</>
	);
}
