import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AdaptersProvider } from "@/features/adapters/ui";
import { AppLayout } from "@/features/app-shell/ui";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: Default react app initialization
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AdaptersProvider>
				<Theme
					accentColor="red"
					appearance="dark"
					grayColor="sage"
					panelBackground="translucent"
				>
					<AppLayout>
						<App />
					</AppLayout>
				</Theme>
			</AdaptersProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>,
);
