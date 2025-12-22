import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AdaptersProvider } from "@/shared/adapters/core/ui";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AdaptersProvider />
			<ReactQueryDevtools buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}

export default App;
