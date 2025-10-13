import { createContext } from "react";
import type { IErrorLoggerAdapter } from "../../domain";

export const ErrorContext = createContext(
	null as unknown as IErrorLoggerAdapter,
);
