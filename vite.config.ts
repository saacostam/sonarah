import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "./",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// @ts-expect-error: Only used for testing - which has a quick feedback loop
	test: {  
		coverage: {
			provider: 'v8',
		},
		globals: true,  
		environment: 'jsdom',  
		setupFiles: ['./src/tests/setup.ts'],  
	}, 
});
