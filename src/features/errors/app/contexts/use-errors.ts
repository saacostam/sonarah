import { useContext } from "react";
import { ErrorContext } from "./errors.context";

export function useErrors() {
	return useContext(ErrorContext);
}
