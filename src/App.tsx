import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router";
import { AuthGuard } from "@/features/auth/ui";
import { AdaptersProvider } from "@/shared/adapters/core/ui";
import { ClientsProvider } from "@/shared/clients/ui";
import { Background } from "@/shared/components";

const queryClient = new QueryClient();

function App() {
	return (
		<Theme accentColor="indigo" grayColor="slate" panelBackground="translucent">
			<Background>
				<QueryClientProvider client={queryClient}>
					<AdaptersProvider>
						<ClientsProvider>
							<AuthGuard>
								<Outlet />
							</AuthGuard>
						</ClientsProvider>
					</AdaptersProvider>
					<ReactQueryDevtools buttonPosition="bottom-left" />
				</QueryClientProvider>
			</Background>
		</Theme>
	);
}

export default App;
