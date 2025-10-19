import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AdaptersProvider } from "@/features/adapters/ui";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Theme
				accentColor="red"
				appearance="dark"
				grayColor="sage"
				panelBackground="translucent"
			>
				<AdaptersProvider />
			</Theme>
			<ReactQueryDevtools buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}

export default App;
