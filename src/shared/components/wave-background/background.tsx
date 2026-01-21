import type { PropsWithChildren } from "react";
import { BackgroundWave } from ".";

export function Background({ children }: PropsWithChildren) {
	return (
		<div className="app-shell">
			<BackgroundWave className="app-shell__bg" />
			{children}
		</div>
	);
}
