import { createContext } from "react";
import type { IRouterAdapter } from "../../domain";

export const RouterContext = createContext(null as unknown as IRouterAdapter);
