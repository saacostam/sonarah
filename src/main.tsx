import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { AdaptersProvider } from "@/features/adapters/ui";
import App from "./App";
import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: Default react app initialization
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AdaptersProvider>
			<Theme accentColor="crimson">
				<App />
			</Theme>
		</AdaptersProvider>
	</StrictMode>,
);
