import { Flex, Heading, Tooltip } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { PolymorphicButton } from "@/shared/components";
import { PlayIcon } from "@/shared/icons";

export interface ManagePlaylistShellProps {
	onNextHref: string;
	title: string;
}

export function ManagePlaylistShell({
	children,
	onNextHref,
	title,
}: PropsWithChildren<ManagePlaylistShellProps>) {
	return (
		<>
			<Flex align="end" direction="row" justify="between" mb="4">
				<Heading>{title}</Heading>
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
			{children}
		</>
	);
}
