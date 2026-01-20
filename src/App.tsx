import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router";
import { AuthGuard } from "@/features/auth/ui";
import { AdaptersProvider } from "@/shared/adapters/core/ui";
import { RepositoriesProvider } from "@/shared/repositories/ui";

const queryClient = new QueryClient();

function App() {
	return (
		<Theme accentColor="iris" grayColor="sage" panelBackground="translucent">
			<QueryClientProvider client={queryClient}>
				<AdaptersProvider>
					<RepositoriesProvider>
						<AuthGuard>
							<Outlet />
						</AuthGuard>
					</RepositoriesProvider>
				</AdaptersProvider>
				<ReactQueryDevtools buttonPosition="bottom-left" />
			</QueryClientProvider>
		</Theme>
	);
}

export default App;
