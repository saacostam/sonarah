import { createContext } from "react";
import type { IAuthAdapter } from "../../domain";

export const AuthContext = createContext<IAuthAdapter>(
	null as unknown as IAuthAdapter,
);
