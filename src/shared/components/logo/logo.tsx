import { Heading } from "@radix-ui/themes";
import { AudioWaveIcon } from "@/shared/icons";

export function Logo() {
	return (
		<Heading
			size="5"
			style={{
				color: "var(--accent-9)",
				display: "flex",
				alignItems: "center",
				gap: "0.75rem",
			}}
		>
			<AudioWaveIcon width={24} height={24} /> sonarah
		</Heading>
	);
}
