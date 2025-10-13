import { Container } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";
import { Navbar } from "@/features/navbar/ui";

export function AppLayout({ children }: PropsWithChildren) {
	return (
		<>
			<Navbar />
			<Container>{children}</Container>
		</>
	);
}
