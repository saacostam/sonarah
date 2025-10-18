import { createContext } from "react";
import type { IRepositories } from "../../domain";

export const RepositoriesContext = createContext(
	null as unknown as IRepositories,
);
