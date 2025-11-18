import { useContext } from "react";
import { RepositoriesContext } from "./repositories.context";

export function useRepositories() {
	return useContext(RepositoriesContext);
}
