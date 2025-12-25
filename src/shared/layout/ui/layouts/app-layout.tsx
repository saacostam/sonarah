import { Container } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { Navbar } from "@/features/navbar/ui";
import { BackgroundWave } from "@/shared/components";

export function AppLayout({ children }: PropsWithChildren) {
	return (
		<div className="app-shell">
			<BackgroundWave className="app-shell__bg" />
			<Navbar />
			<Container mt="6" px="4">
				{children}
			</Container>
		</div>
	);
}
