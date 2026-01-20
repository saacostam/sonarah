import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router";
import { AuthGuard } from "@/features/auth/ui";
import { AdaptersProvider } from "@/shared/adapters/core/ui";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AdaptersProvider>
				<AuthGuard>
					<Outlet />
				</AuthGuard>
			</AdaptersProvider>
			<ReactQueryDevtools buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}

export default App;
