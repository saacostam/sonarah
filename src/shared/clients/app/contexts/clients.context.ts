import { createContext } from "react";
import type { IClients } from "../../domain";

export const ClientsContext = createContext(null as unknown as IClients);
