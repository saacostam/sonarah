import {
	type CSSProperties,
	type PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react";

export interface RelativeScrollProps {
	anchor: HTMLElement | null;
	style?: CSSProperties;
}

export function RelativeScroll({
	anchor,
	children,
	style,
}: PropsWithChildren<RelativeScrollProps>) {
	const [deltaY, setDeltaY] = useState(0);

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onScrollHandler = () => {
			if (!ref.current) return;

			if (!anchor) return;

			const anchorElementBounds = anchor.getClientRects().item(0);
			const containerBounds = ref.current.getClientRects().item(0);

			if (!anchorElementBounds || !containerBounds) return;

			setDeltaY(
				Math.max(0, Math.abs(containerBounds.y - anchorElementBounds.y)),
			);
		};

		onScrollHandler();
		window.addEventListener("scroll", onScrollHandler);
		return () => window.removeEventListener("scroll", onScrollHandler);
	}, [anchor]);

	return (
		<div style={{ width: "100%", padding: 0, ...style }} ref={ref}>
			<div style={{ marginTop: deltaY }}>{children}</div>
		</div>
	);
}
