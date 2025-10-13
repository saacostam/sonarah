import { useContext } from "react";
import { AdaptersContext } from "./adapters.context";

export function useAdapters() {
    return useContext(AdaptersContext);
}
