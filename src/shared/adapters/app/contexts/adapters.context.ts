import { createContext } from "react";
import type { IAdapters } from "../../domain";

export const AdaptersContext = createContext(null as unknown as IAdapters);
