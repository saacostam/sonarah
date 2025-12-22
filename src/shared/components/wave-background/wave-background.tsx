export interface BackgroundWaveProps {
	className?: string;
	opacity?: number;
	animated?: boolean;
}

export function BackgroundWave({
	className,
	opacity = 0.58,
	animated = true,
}: BackgroundWaveProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1440 560"
			preserveAspectRatio="none"
			aria-hidden="true"
			className={className}
		>
			<rect width="1440" height="560" fill="var(--gray-1)" />
			<g
				fill="none"
				stroke="var(--accent-4)"
				strokeWidth="2"
				strokeOpacity={opacity}
				className={animated ? "background-wave__lines" : undefined}
			>
				<path d="M182.59 603.26C359.97 602.55 517.75 465.36 877.91 462.05 1238.06 458.74 1389.74 230.01 1573.22 226.85" />
				<path d="M732.18 564.42C853.9 485.76 786.57 57.54 1004.45 52.64 1222.34 47.74 1403.38 256.38 1549 259.84" />
				<path d="M203.29 566.89C392.43 561.59 531.02 291.49 904.98 283.27 1278.94 275.05 1421.68 51.17 1606.67 48.07" />
				<path d="M769.99 664.07C882.93 583.3 809.16 176.48 1015.53 165.9 1221.91 155.32 1380.05 288.16 1506.62 289.1" />
				<path d="M756.05 614.3C889.64 586.29 948.9 240.71 1152.97 239.39 1357.04 238.07 1440.52 419.73 1549.89 424.19" />
			</g>
		</svg>
	);
}
