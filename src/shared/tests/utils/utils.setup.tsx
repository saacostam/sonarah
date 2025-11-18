import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { AdaptersContext } from "@/features/adapters/app";
import type { IAdapters } from "@/features/adapters/domain";
import { RepositoriesContext } from "@/shared/repositories/app";
import type { IRepositories } from "@/shared/repositories/domain";

// REPOSITORIES
export type MockRepositories = {
	[K in keyof IRepositories]?: Partial<IRepositories[K]>;
};

interface RepositoryProviderProps {
	children: ReactNode;
	mock?: MockRepositories;
}

export function MockRepositoryProvider({
	children,
	mock,
}: RepositoryProviderProps) {
	const value = mock as IRepositories;
	return (
		<RepositoriesContext.Provider value={value}>
			{children}
		</RepositoriesContext.Provider>
	);
}

// ADAPTERS
export type MockAdapters = {
	[K in keyof IAdapters]?: Partial<IAdapters[K]>;
};

interface AdapterProviderProps {
	children: ReactNode;
	mock?: MockAdapters;
}

export function MockAdaptersProvider({ children, mock }: AdapterProviderProps) {
	const value = mock as IAdapters;
	return (
		<AdaptersContext.Provider value={value}>
			{children}
		</AdaptersContext.Provider>
	);
}

// NON INVERTED DEPENDENCIES
// ✅ A fresh QueryClient per test avoids cache bleed between tests
const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // don't retry by default in tests
			},
		},
	});

interface ProvidersProps {
	children: ReactNode;
	initialEntries?: string[]; // optional initial routes
}

export function TestProviders({
	children,
	initialEntries = ["/"],
}: ProvidersProps) {
	const queryClient = createTestQueryClient();

	return (
		<Theme>
			<MemoryRouter initialEntries={initialEntries}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</MemoryRouter>
		</Theme>
	);
}
