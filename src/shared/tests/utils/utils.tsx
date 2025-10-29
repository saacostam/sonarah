import {
	type RenderHookOptions,
	type RenderOptions,
	render,
	renderHook,
} from "@testing-library/react";
import {
	type MockAdapters,
	MockAdaptersProvider,
	type MockRepositories,
	MockRepositoryProvider,
	TestProviders,
} from "./utils.setup";

/**
 * Shared wrapper factory for consistent provider hierarchy
 */
function createWrapper({
	adapters,
	initialEntries,
	repositories,
}: {
	adapters?: MockAdapters;
	initialEntries?: string[];
	repositories?: MockRepositories;
}) {
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<TestProviders initialEntries={initialEntries}>
				<MockRepositoryProvider mock={repositories}>
					<MockAdaptersProvider mock={adapters}>
						{children}
					</MockAdaptersProvider>
				</MockRepositoryProvider>
			</TestProviders>
		);
	};
}

/**
 * Render a React component with all test providers.
 */
export function renderWithProviders(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, "wrapper"> & {
		adapters?: MockAdapters;
		initialEntries?: string[];
		repositories?: MockRepositories;
	},
) {
	const { adapters, initialEntries, repositories, ...renderOptions } =
		options ?? {};

	return render(ui, {
		wrapper: createWrapper({ adapters, initialEntries, repositories }),
		...renderOptions,
	});
}

/**
 * Render a React hook with all test providers.
 */
export function renderHookWithProviders<Result, Props>(
	callback: (props: Props) => Result,
	options?: Omit<RenderHookOptions<Props>, "wrapper"> & {
		adapters?: MockAdapters;
		initialEntries?: string[];
		repositories?: MockRepositories;
	},
) {
	const { adapters, initialEntries, repositories, ...renderOptions } =
		options ?? {};

	return renderHook(callback, {
		wrapper: createWrapper({ adapters, initialEntries, repositories }),
		...renderOptions,
	});
}
