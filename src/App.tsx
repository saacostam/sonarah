import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router";
import { AuthGuard } from "@/features/auth/ui";
import { AdaptersProvider } from "@/shared/adapters/core/ui";
import { Background } from "@/shared/components";
import { RepositoriesProvider } from "@/shared/repositories/ui";

const queryClient = new QueryClient();

function App() {
	return (
		<Theme accentColor="iris" grayColor="sage" panelBackground="translucent">
			<Background>
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
			</Background>
		</Theme>
	);
}

export default App;
