import { useContext } from "react";
import { ClientsContext } from "./clients.context";

export function useClients() {
	return useContext(ClientsContext);
}
