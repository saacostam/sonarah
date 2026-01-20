import { Flex } from "@radix-ui/themes";
import type { CSSProperties } from "react";
import { RingLoader } from "react-spinners";

export interface LazyLoadedSkeletonProps {
	style?: CSSProperties;
}

export function LazyLoadedSkeleton({ style }: LazyLoadedSkeletonProps) {
	return (
		<Flex
			align="center"
			justify="center"
			style={{ ...style, margin: style?.margin ?? "8rem 0" }}
			data-testid="lazy-loaded-skeleton"
		>
			<RingLoader color="var(--accent-9)" size="128" />
		</Flex>
	);
}
