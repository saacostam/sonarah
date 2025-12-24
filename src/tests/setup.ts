import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

global.ResizeObserver = class {
	observe() {
		/* empty */
	}
	unobserve() {
		/* empty */
	}
	disconnect() {
		/* empty */
	}
};
